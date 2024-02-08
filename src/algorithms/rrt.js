import {getDist} from "./utils";
import {Node} from "./utils";
const VISION_DISTANCE = 30.0

function RRT(map) {
    const MAX_NODES = 2000
    map.add_node(map.get_start());
    let size = map.get_size()
    const width = size[0]
    const height = size[1]
    while (map.get_num_nodes() < MAX_NODES) {
        // TODO: Implement the logic for RRT in JavaScript
        let random_node = map.get_random_valid_node();
        // track the closest distance and the corresponding node
        let min_dist = Infinity;
        let nearest = null;
        // iterate through the nodes
        for (const node of map.get_nodes()) {
            const distance = getDist(node, random_node);
            if (distance < min_dist) {
                min_dist = distance;
                nearest = node;
            }
        }
        if(nearest==null){
            continue
        }
        random_node = map.step_from_to(nearest, random_node);
        map.add_path(nearest, random_node);
        if (map.is_solved()) {
            break;
        }
    }

    const path = map.get_path();
    const smoothed_path = map.get_smoothed_path();

    if (map.is_solution_valid()) {
        console.log("A valid solution has been found :-) ");
        console.log("Nodes created: ", map.get_num_nodes());
        console.log("path: ", path)
        console.log("smoothed path: ",smoothed_path)
        console.log("goal nodes: ", map.get_goals())
        console.log("Path length: ", path.length);
        console.log("Smoothed path length: ", smoothed_path.length);
    } else {
        console.log("Please try again :-(");
    }
}


async function robot_planning_with_exploration(robbie, map) {
    map.check_new_obstacles(robbie, VISION_DISTANCE);
    RRT(map);
    let path = map.get_smoothed_path();

    // while the current robot position is not at the goal:
    while (getDist(robbie, map.get_goals()[0]) > 1) {
        // Get the next node from the path
        let next_pos = path.shift();

        let angle_to_turn = Math.atan2(next_pos.y - robbie.y, next_pos.x - robbie.x);
        // follow piazza post
        angle_to_turn -= robbie.theta;
        robbie.turn_in_place(angle_to_turn);

        // while robot has not reached the next node in the path
        while (getDist(robbie, next_pos) > 1) {
            // detect any visible obstacles and update cmap
            if (map.check_new_obstacles(robbie, VISION_DISTANCE)) {
                map.reset(new Node(robbie.getX(), robbie.getY()));
                RRT(map);
                path = map.get_smoothed_path();
                next_pos = path.shift();

                angle_to_turn = Math.atan2(next_pos.y - robbie.y, next_pos.x - robbie.x);
                // follow piazza post
                angle_to_turn -= robbie.theta;
                robbie.turn_in_place(angle_to_turn);
            }
            // otherwise, drive straight towards the next node within vision distance
            const distanceToMove = Math.min(VISION_DISTANCE, getDist(robbie, next_pos));
            await robbie.move_forward(distanceToMove);
        }
    }
}

export {RRT}
