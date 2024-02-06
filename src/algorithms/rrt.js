import {getDist} from "./utils";
import {Node} from "./utils";
const VISION_DISTANCE = 30.0

function RRT(map) {
    const MAX_NODES = 20000
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
        console.log("random node")
        console.log(random_node)
        // iterate through the nodes
        for (const node of map.get_nodes()) {
            console.log(node)
            const distance = getDist(node, random_node);
            console.log("distance: " + distance)
            if (distance < min_dist) {
                min_dist = distance;
                nearest = node;
            }
        }
        if(!nearest){
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
        console.log("goal nodes: ", map.get_goals())
        console.log("Path length: ", path.length);
        console.log("Smoothed path length: ", smoothed_path.length);
    } else {
        console.log("Please try again :-(");
    }
}
function rrt(map, step_limit = 2.5) {
    const start_node = map.get_start()
    const goal_node = map.get_goals()[0]
    let node_list = [start_node];
    while (true) {
        if (node_list.length > 20000) {
            node_list = [start_node];
            console.log("Re-running RRT");
        }
        if (Math.random() <= 0.25) {
            var x = goal_node.getX(), y = goal_node.getY();
        } else {
            let node = map.get_random_valid_node();
            x= node.getX()
            y = node.getY()
        }
        const rand_node = new Node([x, y]);
        let nearest_node_dist = Infinity;
        let nearest_node = null;
        for (const node of node_list) {
            if (getDist(node, rand_node) < nearest_node_dist &&
                !map.is_collision_with_obstacles(node, rand_node)) {
                nearest_node_dist = getDist(node, rand_node);
                nearest_node = node;
            }
        }
        if (!nearest_node) {
            continue;
        }

        // Step towards rand node from nearest node
        let new_node;
        if (getDist(nearest_node, rand_node) < step_limit) {
            new_node = rand_node;
        } else {
            const theta = Math.atan2(rand_node.getY() - nearest_node.getY(), rand_node.getX() - nearest_node.getX());
            new_node = new Node([
                nearest_node.x + step_limit * Math.cos(theta),
                nearest_node.y + step_limit * Math.sin(theta)
            ]);
        }
        new_node.parent = nearest_node;
        node_list.push(new_node);

        // Check ending condition
        if (getDist(new_node, goal_node) < 0.5) {
            goal_node.parent = new_node;
            break;
        }
    }

    let path = [goal_node];
    let curr_node = goal_node;
    while (curr_node !== start_node) {
        curr_node = curr_node.parent;
        path.push(curr_node);
    }
    path = path.reverse();

    // path smoothing
    let plen = path.length;
    if (plen !== 0) {
        //run 100 trials
        for (let i = 0; i < 100; i++) {
            //pick two random indices
            const indices = [Math.floor(Math.random() * plen), Math.floor(Math.random() * plen)];
            indices.sort();

            //if they are not the same or consecutive
            if (indices[1] - indices[0] > 1) {
                const p1 = path[indices[0]];
                const p2 = path[indices[1]];

                //connect the two nodes directly if there is a straight line between them
                if (!map.is_collision_with_obstacles(p1, p2)) {
                    path = path.slice(0, indices[0] + 1).concat(path.slice(indices[1]));
                    plen = path.length;
                }
            }
        }
    }
    console.log(path)
    return path;
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

let sleepSetTimeout_ctrl;
function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

export {rrt,RRT}
