"""
Process communication example

Covers:

- Resources: Store

Scenario:
  This example shows how to interconnect simulation model elements
  together using :class:`~simpy.resources.store.Store` for one-to-one,
  and many-to-one asynchronous processes. For one-to-many a simple
  BroadCastPipe class is constructed from Store.

When Useful:
  When a consumer process does not always wait on a generating process
  and these processes run asynchronously. This example shows how to
  create a buffer and also tell is the consumer process was late
  yielding to the event from a generating process.

  This is also useful when some information needs to be broadcast to
  many receiving processes

  Finally, using pipes can simplify how processes are interconnected to
  each other in a simulation model.

Example By:
  Keith Smith

"""
import random

from simplay import VisualEnvironment, VisualStore, VisualGrid, VisualProcess

import simpy


RANDOM_SEED = 42
SIM_TIME = 100

output_conn_positions = [[0, 1], [2, 1]]
generator_positions = [[1, 0], [2, 0]]


class BroadcastPipe(object):
    """A Broadcast pipe that allows one process to send messages to many.

    This construct is useful when message consumers are running at
    different rates than message generators and provides an event
    buffering to the consuming processes.

    The parameters are used to create a new
    :class:`~simpy.resources.store.Store` instance each time
    :meth:`get_output_conn()` is called.

    """

    def __init__(self, env, capacity=simpy.core.Infinity):
        self.env = env
        self.capacity = capacity
        self.pipes = []

    def put(self, value):
        """Broadcast a *value* to all receivers."""
        if not self.pipes:
            raise RuntimeError('There are no output pipes.')
        events = [store.put(value) for store in self.pipes]
        return self.env.all_of(events)  # Condition event for all "events"

    def get_output_conn(self):
        """Get a new output connection for this broadcast pipe.

        The return value is a :class:`~simpy.resources.store.Store`.

        """
        position = output_conn_positions.pop(0)
        pipe = VisualStore(
            self.env, "pipe" + str(position[0]) + str(position[1]), "PIPE", capacity=self.capacity)
        pipe.is_at(position[0], position[1])
        pipe.is_visible()
        self.pipes.append(pipe)
        return pipe

    def has_tint(self, color):
        [store.has_tint(color) for store in self.pipes]


class Message_generator(VisualProcess):

    def __init__(self, env: VisualEnvironment, id: str, out_pipe: VisualStore):
        super().__init__(env, id, "GENERATOR", 0xFFFFFF)
        self.out_pipe = out_pipe
        position = generator_positions.pop(0)
        self.is_at(position[0], position[1])
        self.is_visible()

    def run(self):
        """A process which randomly generates messages."""
        while True:
            # wait for next transmission
            yield self.env.timeout(random.randint(6, 10))

            # messages are time stamped to later check if the consumer was
            # late getting them.  Note, using event.triggered to do this may
            # result in failure due to FIFO nature of simulation yields.
            # (i.e. if at the same env.now, message_generator puts a message
            # in the pipe first and then message_consumer gets from pipe,
            # the event.triggered will be True in the other order it will be
            # False
            msg = (self.env.now, '%s says hello at %d' %
                   (self.id, self.env.now))
            if hasattr(self.out_pipe, "pipes"):
                [self.is_interacting_with(store)
                 for store in self.out_pipe.pipes]
            else:
                self.is_interacting_with(self.out_pipe)
            self.out_pipe.put(msg)
            # If the out_pipe has a delay in consuming the pipe will be marked yellow
            self.out_pipe.has_tint(0xFFFF00)
            yield self.env.timeout(1)
            if hasattr(self.out_pipe, "pipes"):
                [self.is_no_longer_interacting_with(
                    store) for store in self.out_pipe.pipes]
            else:
                self.is_no_longer_interacting_with(self.out_pipe)


def message_consumer(name, env: VisualEnvironment, in_pipe: VisualStore):
    """A process which consumes messages."""
    while True:
        # Get event for message pipe
        msg = yield in_pipe.get()

        if msg[0] < env.now:
            # if message was already put into pipe, then
            # message_consumer was late getting to it. Depending on what
            # is being modeled this, may, or may not have some
            # significance
            print('LATE Getting Message: at time %d: %s received message: %s' %
                  (env.now, name, msg[1]))
            in_pipe.has_decorating_text('LATE Getting Message: at time %d: %s received message: \n %s' %
                                        (env.now, name, msg[1]))
            in_pipe.has_tint(0xFF0000)

        else:
            # message_consumer is synchronized with message_generator
            print('at time %d: %s received message: %s.' %
                  (env.now, name, msg[1]))
            in_pipe.has_decorating_text(str('at time %d: %s received message: \n %s.' %
                                            (env.now, name, msg[1])))
            in_pipe.has_tint(0x00FF00)

        # Process does some other work, which may result in missing messages
        yield env.timeout(random.randint(4, 8))


# Setup and start the simulation
print('Process communication')
random.seed(RANDOM_SEED)
env = VisualEnvironment()
env.visualization_manager.register_visual(
    "PIPE", "./process_communication_assets/message_consumer.png")
env.visualization_manager.register_visual(
    "GENERATOR", "./process_communication_assets/generator.png")
grid = VisualGrid(1000, 1000, 3, 3)
env.visualization_manager.set_grid(grid)

# For one-to-one or many-to-one type pipes, use Store
pipe = VisualStore(env, "pipe", "PIPE")
pipe.is_at(1, 1)
pipe.is_visible()
env.process(Message_generator(env, 'Generator A', pipe).run())
env.process(message_consumer('Consumer A', env, pipe))
print('\nOne-to-one pipe communication\n')

# For one-to many use BroadcastPipe comment out the lines 176 to 181 and comment the lines 168 to 173
# (Note: could also be used for one-to-one,many-to-one or many-to-many)
# bc_pipe = BroadcastPipe(env)
# env.process(Message_generator(env, 'Generator A', bc_pipe).run())
# env.process(message_consumer('Consumer A', env, bc_pipe.get_output_conn()))
# env.process(message_consumer('Consumer B', env, bc_pipe.get_output_conn()))
# print('\nOne-to-many pipe communication\n')

env.run(until=SIM_TIME)

# you can extract the output from the visualization manager
output = env.visualization_manager.serialize()

# or save the output to a file directly
env.visualization_manager.write_to_file("output.simplay")

# or, if you're working in jupyter lab and have the simplay-jupyter
# extensions installed, you can display the output

# if so, uncomment the following lines
# from IPython.display import display
# display(env.visualization_manager.serialize_for_jupyter(), raw=True)
