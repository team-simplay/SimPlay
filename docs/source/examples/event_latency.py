"""
Event Latency example

Covers:

- Resources: Store

Scenario:
  This example shows how to separate the time delay of events between
  processes from the processes themselves.

When Useful:
  When modeling physical things such as cables, RF propagation, etc.  it
  better encapsulation to keep this propagation mechanism outside of the
  sending and receiving processes.

  Can also be used to interconnect processes sending messages

Example by:
  Keith Smith

"""
import simpy
from simplay import VisualEnvironment, VisualGrid, VisualProcess, VisualStore


SIM_DURATION = 100


class Cable(VisualStore):
    """This class represents the propagation through a cable."""

    def __init__(self, env, delay):
        super().__init__(env, "Cable", "CABLE", capacity=1000)
        self.delay = delay
        self.is_at(1, 0)
        self.number_of_messages_in_cable = 0
        self.is_visible()

    def latency(self, value):
        yield self.env.timeout(self.delay)
        super().put(value)

    def put(self, value):
        self.number_of_messages_in_cable += 1
        self.has_decorating_text(
            str('number of messages in cable %d' % self.number_of_messages_in_cable))
        self.has_tint(0xFFFF00)
        self.env.process(self.latency(value))

    def get(self):
        if self.number_of_messages_in_cable > 0:
            self.number_of_messages_in_cable -= 1
        self.has_decorating_text(
            str('number of messages in cable %d' % self.number_of_messages_in_cable))
        return super().get()


class Sender(VisualProcess):
    def __init__(self, env: VisualEnvironment, cable: Cable):
        super().__init__(env, "Sender", "SENDER")
        self.cable = cable
        self.is_at(0, 0)
        self.is_visible()

    def run(self):
        """A process which randomly generates messages."""
        while True:
            # wait for next transmission
            yield self.env.timeout(4)
            self.is_interacting_with(self.cable)
            yield self.env.timeout(1)
            self.cable.put('Sender sent this at %d' % self.env.now)
            self.is_no_longer_interacting_with(self.cable)


class Receiver(VisualProcess):
    def __init__(self, env: VisualEnvironment, cable: Cable):
        super().__init__(env, "Receiver", "RECEIVER")
        self.cable = cable
        self.is_at(2, 0)
        self.is_visible()

    def run(self):
        """A process which consumes messages."""
        while True:
            # Get event for message pipe
            msg = yield self.cable.get()
            self.is_interacting_with(self.cable)
            yield self.env.timeout(1)
            print('Received this at %d while %s' % (self.env.now, msg))
            self.has_decorating_text(
                str('Received this at %d while %s' % (self.env.now, msg)))
            self.is_no_longer_interacting_with(self.cable)


# Setup and start the simulation
print('Event Latency')
env = VisualEnvironment()
grid = VisualGrid(1000, 1000, 3, 1)
env.visualization_manager.set_grid(grid)
env.visualization_manager.register_visual(
    "SENDER", "./event_latency_assets/sender.png")
env.visualization_manager.register_visual(
    "RECEIVER", "./event_latency_assets/receiver.png")
env.visualization_manager.register_visual(
    "CABLE", "./event_latency_assets/cable.png")

cable = Cable(env, 9)
env.process(Sender(env, cable).run())
env.process(Receiver(env, cable).run())

env.run(until=SIM_DURATION)

# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
# from IPython.display import display
# display(env.visualization_manager.serialize_for_jupyter(), raw=True)
