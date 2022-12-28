"""
Bank renege example

Covers:

- Resources: Resource
- Condition events

Scenario:
A counter with a random service time and customers who renege. Based on the
program bank08.py from TheBank tutorial of SimPy 2. (KGM)

"""
from IPython.display import display
import random
from simplay import VisualEnvironment, VisualProcess, VisualResource, VisualGrid

RANDOM_SEED = 42
NEW_CUSTOMERS = 6  # Total number of customers
INTERVAL_CUSTOMERS = 10.0  # Generate new customers roughly every x seconds
MIN_PATIENCE = 1  # Min. customer patience
MAX_PATIENCE = 3  # Max. customer patience

free_positions = [[1, 0], [1, 1], [1, 2]]


def source(env, number, interval, counter):
    """Source generates customers randomly"""
    for i in range(number):
        c = Customer(env, 'Customer%02d' % i, counter, time_in_bank=12.0)
        env.process(c.run())
        t = random.expovariate(1.0 / interval)
        yield env.timeout(t)


class Customer(VisualProcess):
    def __init__(self, env, id, counter, time_in_bank):
        color = int(random.random() * 0xFFFFFF)
        super().__init__(env, id, visual="CUSTOMER", tint=color)
        self.counter = counter
        self.time_in_bank = time_in_bank
        self.position = free_positions.pop(0)

    def run(self):
        """Customer arrives, is served and leaves."""
        self.is_visible()
        self.is_at(self.position[0], self.position[1])
        arrive = self.env.now
        print('%7.4f %s: Here I am' % (arrive, self.id))

        with self.counter.request() as req:
            patience = random.uniform(MIN_PATIENCE, MAX_PATIENCE)
            # Wait for the counter or abort at the end of our tether
            results = yield req | env.timeout(patience)

            wait = self.env.now - arrive

            if req in results:
                # We got to the counter
                self.is_near(self.counter)
                self.is_interacting_with(self.counter)
                print('%7.4f %s: Waited %6.3f' % (self.env.now, self.id, wait))

                tib = random.expovariate(1.0 / self.time_in_bank)
                yield self.env.timeout(tib)
                self.is_invisible()
                self.is_no_longer_interacting_with(self.counter)
                free_positions.append(self.position)
                print('%7.4f %s: Finished' % (self.env.now, self.id))

            else:
                # We reneged
                print('%7.4f %s: RENEGED after %6.3f' %
                      (self.env.now, self.id, wait))
                self.is_invisible()
                self.is_no_longer_interacting_with(self.counter)
                free_positions.append(self.position)


# Setup and start the simulation
print('Bank renege')
random.seed(RANDOM_SEED)
env = VisualEnvironment()
grid = VisualGrid(1000, 1000, 2, 3)
grid.set_area("counter", "Counter", 3, 1, 0, 0, 0x707070)
env.visualization_manager.set_grid(grid)
env.visualization_manager.register_visual(
    "CUSTOMER", "./bank_assets/user.png")
env.visualization_manager.register_visual(
    "COUNTER", "./bank_assets/counter.png")

# Start processes and run


class Counter(VisualResource):
    def __init__(self, env):
        super().__init__(env, "Counter", 1, visual="COUNTER")
        self.is_at(0, 1)
        self.is_visible()


counter = Counter(env)
env.process(source(env, NEW_CUSTOMERS, INTERVAL_CUSTOMERS, counter))
env.run()

# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
# from IPython.display import display
# display(env.visualization_manager.serialize_for_jupyter(), raw=True)
