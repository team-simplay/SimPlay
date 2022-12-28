"""
Machine shop example

Covers:

- Interrupts
- Resources: PreemptiveResource

Scenario:
  A workshop has *n* identical machines. A stream of jobs (enough to
  keep the machines busy) arrives. Each machine breaks down
  periodically. Repairs are carried out by one repairman. The repairman
  has other, less important tasks to perform, too. Broken machines
  preempt theses tasks. The repairman continues them when he is done
  with the machine repair. The workshop works continuously.

"""
import random

from simplay import VisualEnvironment, VisualProcess, VisualPreemptiveResource, VisualGrid
import simpy


RANDOM_SEED = 42
PT_MEAN = 10.0         # Avg. processing time in minutes
PT_SIGMA = 2.0         # Sigma of processing time
MTTF = 300.0           # Mean time to failure in minutes
BREAK_MEAN = 1 / MTTF  # Param. for expovariate distribution
REPAIR_TIME = 30.0     # Time it takes to repair a machine in minutes
JOB_DURATION = 30.0    # Duration of other jobs in minutes
NUM_MACHINES = 10      # Number of machines in the machine shop
WEEKS = 4              # Simulation time in weeks
SIM_TIME = WEEKS * 7 * 24 * 60  # Simulation time in minutes


def time_per_part():
    """Return actual processing time for a concrete part."""
    return random.normalvariate(PT_MEAN, PT_SIGMA)


def time_to_failure():
    """Return time until next failure for a machine."""
    return random.expovariate(BREAK_MEAN)


machine_positions = [[0, 0], [1, 0], [2, 0], [3, 0],
                     [4, 0], [5, 0], [1, 1], [2, 1], [3, 1], [4, 1]]


class Machine(VisualProcess):
    """A machine produces parts and my get broken every now and then.

    If it breaks, it requests a *repairman* and continues the production
    after the it is repaired.

    A machine has a *name* and a numberof *parts_made* thus far.

    """

    def __init__(self, env, name, repairman: VisualPreemptiveResource):
        color = int(random.random() * 0x00FFFF)
        super().__init__(env, name, "MACHINE", color)
        self.parts_made = 0
        self.broken = False
        self.repairman = repairman
        self.position = machine_positions.pop(0)
        self.is_at(self.position[0], self.position[1])
        self.is_visible()

        # Start "working" and "break_machine" processes for this machine.
        self.process = env.process(self.working())
        env.process(self.break_machine())

    def working(self):
        """Produce parts as long as the simulation runs.

        While making a part, the machine may break multiple times.
        Request a repairman when this happens.

        """
        while True:
            # Start making a new part
            done_in = time_per_part()
            while done_in:
                try:
                    # Working on the part
                    start = self.env.now
                    yield self.env.timeout(done_in)
                    done_in = 0  # Set to 0 to exit while loop.

                except simpy.Interrupt:
                    self.broken = True
                    done_in -= self.env.now - start  # How much time left?

                    # Request a repairman. This will preempt its "other_job".
                    with self.repairman.request(priority=1) as req:
                        yield req
                        self.repairman.is_near(self)
                        self.repairman.is_interacting_with(self)
                        yield self.env.timeout(REPAIR_TIME)
                        self.repairman.is_no_longer_interacting_with(self)
                        self.repairman.is_at(
                            self.repairman.home[0], self.repairman.home[1])
                    self.broken = False
                    self.has_original_tint()

            # Part is done.
            self.parts_made += 1
            self.has_decorating_text("Parts made: " + str(self.parts_made))

    def break_machine(self):
        """Break the machine every now and then."""
        while True:
            yield self.env.timeout(time_to_failure())
            if not self.broken:
                # Only break the machine if it is currently working.
                self.process.interrupt()
                self.has_tint(0xFF0000)


def other_jobs(env, repairman):
    """The repairman's other (unimportant) job."""
    while True:
        # Start a new job
        done_in = JOB_DURATION
        while done_in:
            # Retry the job until it is done.
            # It's priority is lower than that of machine repairs.
            with repairman.request(priority=2) as req:
                yield req
                try:
                    start = env.now
                    yield env.timeout(done_in)
                    done_in = 0
                except simpy.Interrupt:
                    done_in -= env.now - start


# Setup and start the simulation
print('Machine shop')
random.seed(RANDOM_SEED)  # This helps reproducing the results

# Create an environment and start the setup process
env = VisualEnvironment()
grid = VisualGrid(1000, 1000, 6, 5)
grid.set_area("OtherJobs", "Other jobs", 3, 6, 0, 2, 0x707070)
env.visualization_manager.set_grid(grid)
env.visualization_manager.register_visual(
    "REPAIRMAN", "./machine_shop_assets/repairman.png")
env.visualization_manager.register_visual(
    "MACHINE", "./machine_shop_assets/machine.png")


class Repairman(VisualPreemptiveResource):
    def __init__(self, env, capacity):
        super().__init__(env, "Repairman", capacity, visual="REPAIRMAN")
        self.home = [2, 3]
        self.is_at(2, 3)
        self.is_visible()


repairman = Repairman(env, capacity=1)
machines = [Machine(env, 'Machine %d' % i, repairman)
            for i in range(NUM_MACHINES)]
env.process(other_jobs(env, repairman))

# Execute!
env.run(until=SIM_TIME)

# Analyis/results
print('Machine shop results after %s weeks' % WEEKS)
for machine in machines:
    print('%s made %d parts.' % (machine.id, machine.parts_made))

# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
# from IPython.display import display
# display(env.visualization_manager.serialize_for_jupyter(), raw=True)
