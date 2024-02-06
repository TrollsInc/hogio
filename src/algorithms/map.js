import utils from "./utils"
class Map{
    constructor(exploration_mode) {
        this.width = 650
        this.height = 450
        this.start = [37,37]
        this.goals = [[612, 412]]
        this.obstacles = [[[100, 150], [175, 125], [150, 50], [75, 75]],
            [[350, 425], [375, 350], [300, 325], [275, 400]],
            [[400, 100], [500, 100], [500, 0], [400, 0]]]
        this.nodes = []
        this.node_paths = []
        this.solved = false
        this.smooth_path = []
        this.smoothed = false
        this.restarts = []
        this.exploration_mode = exploration_mode
        this.explored_obstacles = []
    }
    is_inbound(self, node) {
        return (node.getX() >= 0) && (node.getY() >= 0) && (node.getX() < this.width) && (node.getY() < this.height);
    }

    is_collision_with_obstacles(line_segment) {
        if(this.exploration_mode){
            let obstacles = this.explored_obstacles
        }
        else{
            let obstacles = this.obstacles
        }
        let line_start, line_end = line_segment
        for (let i = 0; i<obstacles.length; i++){
            let obstacle = obstacles[i]
            num_sides = len(obstacle)
            for idx in range(num_sides):
            side_start, side_end = obstacle[idx], obstacle[(idx + 1) % num_sides]
            if (line_start, line_end, side_start, side_end):
            return True
        }
        return false
    }
}