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
    VisualEnvironment, VisualContainer, VisualProcess,
    VisualResource, VisualGrid
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
        self.is_visible()
        self.is_near_cell(2, 1)
        fuel_tank_level = random.randint(*FUEL_TANK_LEVEL)

        with self.gas_station.request() as req:
            start = self.env.now
            # Request one of the gas pumps
            yield req
            self.is_near(self.gas_station)
            self.is_interacting_with(self.gas_station)

            # Get the required amount of fuel
            liters_required = FUEL_TANK_SIZE - fuel_tank_level
            yield self.fuel_pump.get(liters_required)

            # The "actual" refueling process takes some time
            yield self.env.timeout(liters_required / REFUELING_SPEED)
            self.is_no_longer_interacting_with(self.gas_station)

        self.is_invisible()


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
        self.is_visible()
        self.is_at(0, 0)
        self.is_near(self.fuel_pump)
        self.is_interacting_with(self.fuel_pump)
        yield self.env.timeout(TANK_TRUCK_TIME)
        ammount = self.fuel_pump.capacity - self.fuel_pump.level
        yield self.fuel_pump.put(ammount)
        self.is_no_longer_interacting_with(self.fuel_pump)
        self.is_invisible()


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
        self.is_at(3, 1)
        self.is_visible()
        self.has_utilization(self.count)


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
        self.is_at(1, 1)
        self.is_visible()
        self.has_level(self.level)
        self.has_frame(4)

    def update_sprite(self):
        fillPercentage = self.level / self.capacity
        if fillPercentage < 0.25:
            self.has_frame(0)
        elif fillPercentage < 0.5:
            self.has_frame(1)
        elif fillPercentage < 0.75:
            self.has_frame(2)
        elif fillPercentage < 1:
            self.has_frame(3)
        else:
            self.has_frame(4)

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

grid = VisualGrid(500, 500, 5, 3)
grid.set_area("gasstation01", "GAS_STATION", 3, 5, 0, 0, 0xbdbbbb)
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
#display({"application/simplay+json": env.visualization_manager.serialize_for_jupyter()}, raw=True)
