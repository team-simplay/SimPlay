"""
Gas Station Refueling example
Covers:
- Resources: Resource
- Resources: Container
- Waiting for other processes
Scenario:
  A gas station has a limited number of gas pumps that share a common
  fuel reservoir. Cars randomly arrive at the gas station, request one
  of the fuel pumps and start refueling from that reservoir.
  A gas station control process observes the gas station's fuel level
  and calls a tank truck for refueling if the station's level drops
  below a threshold.
"""
import itertools
import random

from simplay import (
    VisualEnvironment, BasicVisualUtil, VisualContainer, VisualProcess,
    VisualResource, VisualGrid, ContainerVisualUtil, ResourceVisualUtil
)

RANDOM_SEED = 42
GAS_STATION_SIZE = 500  # liters
THRESHOLD = 20  # Threshold for calling the tank truck (in %)
FUEL_TANK_SIZE = 50  # liters
FUEL_TANK_LEVEL = [5, 25]  # Min/max levels of fuel tanks (in liters)
REFUELING_SPEED = 2  # liters / second
TANK_TRUCK_TIME = 300  # Seconds it takes the tank truck to arrive
T_INTER = [10, 100]  # Create a car every [min, max] seconds
SIM_TIME = 10000  # Simulation time in seconds


class Car(VisualProcess):
    def __init__(self, name, env, gas_station, fuel_pump):
        color = int(random.random() * 0xFFFFFF)
        super().__init__(env, name, visual="CAR", tint=color)
        self.gas_station = gas_station
        self.fuel_pump = fuel_pump

    def run(self):
        BasicVisualUtil.set_visible(self)
        BasicVisualUtil.move_near_cell(self, 2, 1)
        fuel_tank_level = random.randint(*FUEL_TANK_LEVEL)

        with self.gas_station.request() as req:
            start = self.env.now
            # Request one of the gas pumps
            yield req
            BasicVisualUtil.move_near(self, self.gas_station)
            BasicVisualUtil.set_interacting(self, self.gas_station)

            # Get the required amount of fuel
            liters_required = FUEL_TANK_SIZE - fuel_tank_level
            yield self.fuel_pump.get(liters_required)

            # The "actual" refueling process takes some time
            yield self.env.timeout(liters_required / REFUELING_SPEED)
            BasicVisualUtil.set_not_interacting(self, self.gas_station)

        BasicVisualUtil.set_invisible(self)


def gas_station_control(env, fuel_pump):
    """Periodically check the level of the *fuel_pump* and call the tank
    truck if the level falls below a threshold."""
    truck = TankTruck(env, fuel_pump)
    while True:
        if fuel_pump.level / fuel_pump.capacity * 100 < THRESHOLD:
            # We need to call the tank truck now!
            # Wait for the tank truck to arrive and refuel the station
            yield env.process(truck.run())

        yield env.timeout(10)  # Check every 10 seconds


class TankTruck(VisualProcess):
    def __init__(self, env, fuel_pump):
        super().__init__(env, "Tank Truck", visual="TANK_TRUCK", tint=0xFF0000)
        self.fuel_pump = fuel_pump

    def run(self):
        BasicVisualUtil.set_visible(self)
        BasicVisualUtil.set_position(self, 0, 0)
        BasicVisualUtil.move_near(self, self.fuel_pump)
        BasicVisualUtil.set_interacting(self, self.fuel_pump)
        yield self.env.timeout(TANK_TRUCK_TIME)
        ammount = self.fuel_pump.capacity - self.fuel_pump.level
        yield self.fuel_pump.put(ammount)
        BasicVisualUtil.set_not_interacting(self, self.fuel_pump)
        BasicVisualUtil.set_invisible(self)


def car_generator(env, gas_station, fuel_pump):
    """Generate new cars that arrive at the gas station."""
    for i in itertools.count():
        yield env.timeout(random.randint(*T_INTER))
        car = Car("Car %d" % i, env, gas_station, fuel_pump)
        env.process(car.run())


class GasStation(VisualResource):
    def __init__(self, env):
        super().__init__(env, "Gas Station", 3, visual="GAS_STATION",
                         tint=0x00FF00)
        BasicVisualUtil.set_position(self, 3, 1)
        BasicVisualUtil.set_visible(self)
        ResourceVisualUtil.set_utilization(self, self.count)


class FuelPump(VisualContainer):
    def __init__(self, env):
        super().__init__(
            env,
            "Fuel Pump",
            capacity=GAS_STATION_SIZE,
            init=GAS_STATION_SIZE,
            visual="FUEL_PUMP",
            tint=0x000001,
        )
        BasicVisualUtil.set_position(self, 1, 1)
        BasicVisualUtil.set_visible(self)
        ContainerVisualUtil.set_level(self, self.level)
        BasicVisualUtil.set_sprite_frame(self, 4)

    def update_sprite(self):
        fillPercentage = self.level / self.capacity
        if fillPercentage < 0.25:
            BasicVisualUtil.set_sprite_frame(self, 0)
        elif fillPercentage < 0.5:
            BasicVisualUtil.set_sprite_frame(self, 1)
        elif fillPercentage < 0.75:
            BasicVisualUtil.set_sprite_frame(self, 2)
        elif fillPercentage < 1:
            BasicVisualUtil.set_sprite_frame(self, 3)
        else:
            BasicVisualUtil.set_sprite_frame(self, 4)

    def get(self, amount):
        cget = super().get(amount)
        self.update_sprite()
        return cget

    def put(self, amount):
        cput = super().put(amount)
        self.update_sprite()
        return cput


# Setup and start the simulation
random.seed(RANDOM_SEED)

# Create environment and start processes
env = VisualEnvironment()
env.visualization_manager.register_visual("CAR", "./resources/car.png")
env.visualization_manager.register_visual(
    "TANK_TRUCK", "./resources/truck.png")
env.visualization_manager.register_visual(
    "GAS_STATION", "./resources/gaspump.png")
env.visualization_manager.register_sprites(
    "FUEL_PUMP",
    [
        "./resources/pump_000.png",
        "./resources/pump_025.png",
        "./resources/pump_050.png",
        "./resources/pump_075.png",
        "./resources/pump_100.png",
    ],
)

grid = VisualGrid(500, 500, 5, 5)
grid.set_area("gasstation01", "GAS_STATION", 5, 5, 0, 0, 0xbdbbbb)
env.visualization_manager.set_grid(grid)

gas_station = GasStation(env)
fuel_pump = FuelPump(env)
env.process(gas_station_control(env, fuel_pump))
env.process(car_generator(env, gas_station, fuel_pump))

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
#display({"application/simplay+json": output}, raw=True)
