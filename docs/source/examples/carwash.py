"""
Carwash example.

Covers:

- Waiting for other processes
- Resources: Resource

Scenario:
  A carwash has a limited number of washing machines and defines
  a washing processes that takes some (random) time.

  Car processes arrive at the carwash at a random time. If one washing
  machine is available, they start the washing process and wait for it
  to finish. If not, they wait until they an use one.

"""
import random

from simplay import VisualEnvironment, VisualProcess, VisualResource, VisualGrid


RANDOM_SEED = 42
NUM_MACHINES = 2  # Number of machines in the carwash
WASHTIME = 5      # Minutes it takes to clean a car
T_INTER = 7       # Create a car every ~7 minutes
SIM_TIME = 20     # Simulation time in minutes

class Carwash(VisualResource):
    """A carwash has a limited number of machines (``NUM_MACHINES``) to
    clean cars in parallel.

    Cars have to request one of the machines. When they got one, they
    can start the washing processes and wait for it to finish (which
    takes ``washtime`` minutes).

    """

    def __init__(self, env, num_machines, washtime):
        super().__init__(env, "Carwash", num_machines, visual="CARWASH")
        self.washtime = washtime
        self.is_at(1, 3)
        self.is_visible()

    def wash(self, car):
        """The washing processes. It takes a ``car`` processes and tries
        to clean it."""
        yield self.env.timeout(WASHTIME)
        print("Carwash removed %d%% of %s's dirt." %
              (random.randint(50, 99), car))


class Car(VisualProcess):
    def __init__(self, env, id, cw):
        color = int(random.random() * 0xFFFFFF)
        super().__init__(env, id, visual="CAR", tint=color)
        self.cw = cw

    def run(self):
        """The car process (each car has a ``name``) arrives at the carwash
        (``cw``) and requests a cleaning machine.

        It then starts the washing process, waits for it to finish and
        leaves to never come back ...

        """
        print('%s arrives at the carwash at %.2f.' % (self.id, env.now))
        self.is_visible()
        self.is_near_cell(4, 2)
        with self.cw.request() as request:
            yield request
            self.is_near(self.cw)
            self.is_interacting_with(self.cw)
            print('%s enters the carwash at %.2f.' % (self.id, env.now))
            yield env.process(self.cw.wash(self.id))

            print('%s leaves the carwash at %.2f.' % (self.id, env.now))
            self.is_invisible()
            self.is_no_longer_interacting_with(self.cw)


def setup(env, num_machines, washtime, t_inter):
    """Create a carwash, a number of initial cars and keep creating cars
    approx. every ``t_inter`` minutes."""
    # Create the carwash
    carwash = Carwash(env, num_machines, washtime)

    # Create 4 initial cars
    for i in range(4):
        env.process(Car(env, 'Car %d' % i, carwash).run())

    # Create more cars while the simulation is running
    while True:
        yield env.timeout(random.randint(t_inter - 2, t_inter + 2))
        i += 1
        env.process(Car(env, 'Car %d' % i, carwash).run())


# Setup and start the simulation
print('Carwash')
print('Check out http://youtu.be/fXXmeP9TvBg while simulating ... ;-)')
random.seed(RANDOM_SEED)  # This helps reproducing the results

# Create an environment and start the setup process
env = VisualEnvironment()
grid = VisualGrid(1000, 1000, 6, 6)
grid.set_area("Carwash", "Carwash", 6, 3, 0, 0, 0x707070)
env.visualization_manager.set_grid(grid)
env.visualization_manager.register_visual(
    "CAR", "./carwash_assets/car.png")
env.visualization_manager.register_visual(
    "CARWASH", "./carwash_assets/carwash.png")
env.process(setup(env, NUM_MACHINES, WASHTIME, T_INTER))


# Execute!
env.run(until=SIM_TIME)
# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
#from IPython.display import display
#display(env.visualization_manager.serialize_for_jupyter(), raw=True)
