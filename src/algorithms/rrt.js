import {getDist} from "./utils";

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
        console.log("Path length: ", path.length);
        console.log("Smoothed path length: ", smoothed_path.length);
    } else {
        console.log("Please try again :-(");
    }
}
let sleepSetTimeout_ctrl;
function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

export {RRT}
