"""
Movie renege example

Covers:

- Resources: Resource
- Condition events
- Shared events

Scenario:
  A movie theatre has one ticket counter selling tickets for three
  movies (next show only). When a movie is sold out, all people waiting
  to buy tickets for that movie renege (leave queue).

"""
import collections
import random

from simplay import VisualEnvironment, VisualGrid, VisualResource, VisualProcess


RANDOM_SEED = 42
TICKETS = 50  # Number of tickets per movie
SIM_TIME = 120  # Simulate until

row_current_x = 1
row_current_y = 0

COLS = 5
ROWS = 16

def define_next_moviegoer_position():
    global row_current_x
    global row_current_y
    if row_current_x == COLS:
        row_current_y += 1
        row_current_x = 0
    else:
        row_current_x += 1


class Moviegoer(VisualProcess):
    def __init__(self, env, id, movie, num_tickets, theater):
        color = int(random.random() * 0xFFFFFF)
        super().__init__(env, id, "CUSTOMER", color)
        self.movie = movie
        self.num_tickets = num_tickets
        self.theater = theater
        self.is_at(row_current_x, row_current_y)
        define_next_moviegoer_position()
        self.is_visible()

    def run(self):
        """A moviegoer tries to by a number of tickets (*num_tickets*) for
        a certain *movie* in a *theater*.

        If the movie becomes sold out, she leaves the theater. If she gets
        to the counter, she tries to buy a number of tickets. If not enough
        tickets are left, she argues with the teller and leaves.

        If at most one ticket is left after the moviegoer bought her
        tickets, the *sold out* event for this movie is triggered causing
        all remaining moviegoers to leave.

        """
        with self.theater.counter.request() as my_turn:
            # Wait until its our turn or until the movie is sold out
            result = yield my_turn | self.theater.sold_out[self.movie]
            self.is_near(self.theater.counter)
            self.is_interacting_with(self.theater.counter)
            # Check if it's our turn or if movie is sold out
            if my_turn not in result:
                self.theater.num_renegers[self.movie] += 1
                self.is_invisible()
                self.is_no_longer_interacting_with(self.theater.counter)
                return

            # Check if enough tickets left.
            if self.theater.available[self.movie] < self.num_tickets:
                # Moviegoer leaves after some discussion
                yield self.env.timeout(0.5)
                self.is_invisible()
                self.is_no_longer_interacting_with(self.theater.counter)
                return

            # Buy tickets
            self.theater.available[self.movie] -= self.num_tickets
            if self.theater.available[self.movie] < 2:
                # Trigger the "sold out" event for the movie
                self.theater.sold_out[self.movie].succeed()
                self.theater.when_sold_out[self.movie] = env.now
                self.theater.available[self.movie] = 0
            yield self.env.timeout(1)
            self.is_invisible()
            self.is_no_longer_interacting_with(self.theater.counter)


def customer_arrivals(env, theater):
    """Create new *moviegoers* until the sim time reaches 120."""
    while True:
        yield env.timeout(random.expovariate(1 / 0.5))

        movie = random.choice(theater.movies)
        num_tickets = random.randint(1, 6)
        if theater.available[movie]:
            env.process(Moviegoer(
                env, "Movigoer" + str(random.random()), movie, num_tickets, theater).run())


Theater = collections.namedtuple('Theater', 'counter, movies, available, '
                                            'sold_out, when_sold_out, '
                                            'num_renegers')


# Setup and start the simulation
print('Movie renege')
random.seed(RANDOM_SEED)
env = VisualEnvironment()
env.visualization_manager.register_visual('COUNTER', './movie_renege_assets/counter.png')
env.visualization_manager.register_visual('CUSTOMER', './movie_renege_assets/customer.png')
grid = VisualGrid(1000, 1000, COLS, ROWS)
env.visualization_manager.set_grid(grid)

# Create movie theater
counter = VisualResource(env, "Counter", 1, "COUNTER")
counter.is_at(0, 0)
counter.is_visible()
movies = ['Python Unchained', 'Kill Process', 'Pulp Implementation']
available = {movie: TICKETS for movie in movies}
sold_out = {movie: env.event() for movie in movies}
when_sold_out = {movie: None for movie in movies}
num_renegers = {movie: 0 for movie in movies}
theater = Theater(counter, movies, available, sold_out, when_sold_out,
                  num_renegers)

# Start process and run
env.process(customer_arrivals(env, theater))
env.run(until=SIM_TIME)

# Analysis/results
for movie in movies:
    if theater.sold_out[movie]:
        print('Movie "%s" sold out %.1f minutes after ticket counter '
              'opening.' % (movie, theater.when_sold_out[movie]))
        print('  Number of people leaving queue when film sold out: %s' %
              theater.num_renegers[movie])

# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
# from IPython.display import display
# display(env.visualization_manager.serialize_for_jupyter(), raw=True)
