function RRT(map) {
    map.add_node(map.get_start());
    const { width: map_width, height: map_height } = map.get_size();

    while (map.get_num_nodes() < MAX_NODES) {
        // TODO: Implement the logic for RRT in JavaScript
        let random_node = map.node_generator();

        // track the closest distance and the corresponding node
        let min_dist = Infinity;
        let nearest = null;

        // iterate through the nodes
        for (const node of map.get_nodes()) {
            const distance = get_dist(node, random_node);
            if (distance < min_dist) {
                min_dist = distance;
                nearest = node;
            }
        }

        random_node = map.step_from_to(nearest, random_node);
        map.add_path(nearest, random_node);

        if (map.is_solved()) {
            break;
        }
    }

    const path = map.get_path();
    const smoothed_path = map.get_smooth_path();

    if (map.is_solution_valid()) {
        console.log("A valid solution has been found :-) ");
        console.log("Nodes created: ", map.get_num_nodes());
        console.log("Path length: ", path.length);
        console.log("Smoothed path length: ", smoothed_path.length);
    } else {
        console.log("Please try again :-(");
    }
    let sleepSetTimeout_ctrl;

    function sleep(ms) {
        clearInterval(sleepSetTimeout_ctrl);
        return new Promise(resolve => sleepSetTimeout_ctrl = setTimeot(resolve, ms));
    }
}
