from routing_utils import distance_between
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def get_distance_matrix_from_source(source_pt, visit_pts):
    points = [source_pt] + visit_pts
    distance_matrix = [[distance_between(val_i[0], val_i[1], val_j[0], val_j[1]) for idx_i, val_i in enumerate(points)] for idx_j, val_j in enumerate(points)]
    return distance_matrix


def create_data_model(source_pt, visit_pts, vehicle_count):
    """Stores the data for the problem."""
    data = {}
    data['distance_matrix'] = get_distance_matrix_from_source(source_pt, visit_pts)
    data['num_vehicles'] = vehicle_count
    data['start'] = 0
    return data

def get_runs_from_solution(data, manager, routing, solution, nodes):
    routes = []
    for vehicle_id in range(data['num_vehicles']):
        route = []
        index = routing.Start(vehicle_id)
        while not routing.IsEnd(index):
            route.append(nodes[manager.IndexToNode(index)])
            index = solution.Value(routing.NextVar(index))
        routes.append(route)
    return routes
            
def do_solve(source_pt, visit_pts, vehicle_count):
    """Entry point of the program."""
    data = create_data_model(source_pt, visit_pts, vehicle_count)

    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']), vehicle_count, 0)

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback.
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data['distance_matrix'][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add Distance constraint.
    dimension_name = 'Distance'
    routing.AddDimension(
        transit_callback_index,
        0,  # no slack
        3000000000,  # vehicle maximum travel distance
        True,  # start cumul to zero
        dimension_name)
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    return get_runs_from_solution(data, manager, routing, solution, [source_pt] + visit_pts)