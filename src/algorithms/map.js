import {Node, getDist,isZero,onSegment,getOrientation,intersects} from "./utils"
const obs = [[[100, 150], [175, 125], [150, 50], [75, 75]],
    [[350, 425], [375, 350], [300, 325], [275, 400]],
    [[400, 100], [500, 100], [500, 0], [400, 0]]]
class Map{
    constructor(exploration_mode) {
        this.width = 650
        this.height = 450
        this.start = new Node([37,37],null)
        this.goals = new Node([612, 412],null)

        this.obstacles = []
        for(let i=0; i<obs.length;i++){
            this.obstacles.push(new Node(obs[i],null))
        }
        this.nodes = []
        this.node_paths = []
        this.solved = false
        this.smooth_path = []
        this.smoothed = false
        this.exploration_mode = exploration_mode
        this.explored_obstacles = []
    }
    is_inbound(self, node) {
        return (node.getX() >= 0) && (node.getY() >= 0) && (node.getX() < this.width) && (node.getY() < this.height);
    }

    is_collision_with_obstacles(line_segment) {
        let obstacles
        if(this.exploration_mode){
            obstacles = this.explored_obstacles
        }
        else{
            obstacles = this.obstacles
        }
        let line_start = line_segment[0]
        let line_end = line_segment[1]
        for (let i = 0; i<obstacles.length; i++){
            let obstacle = obstacles[i]
            let num_sides = obstacle.length
            for(let index =0; index<num_sides; index++){
                let side_start = obstacle[index]
                let side_end = obstacle[(index + 1) % num_sides]
                if (intersects(line_start, line_end, side_start, side_end)){
                    return true
                }
            }
        }
        return false
    }

    is_inside_obstacles(self, node, use_all_obstacles){
        let obstacles
        if(this.exploration_mode && !use_all_obstacles){
            obstacles = this.explored_obstacles
        }
        else{
            obstacles = this.obstacles
        }
        for (let i = 0; i<obstacles.length; i++){
            let obstacle = obstacles[i]
            let num_sides = obstacle.length
            let is_inside = true
            for(let index =0; index<num_sides; index++){
                let side_start = obstacle[index]
                let side_end = obstacle[(index + 1) % num_sides]
                if (getOrientation(side_start, side_end, node)===2){
                    is_inside = false
                    break
                }
            }
            if(is_inside){
                return true
            }
        }
        return false
    }

    get_size(){
        return [this.width,this.height]
    }
    get_nodes(){
        return this.nodes
    }
    get_goals(){
        return this.goals
    }
    reset(node){
        this.set_start(node)
        this.reset_paths()
    }
    get_num_nodes(){
        return this.nodes.length
    }
    set_start(node){
        this.start = new Node(node.getX(),node.getY())
    }
    get_start(){
        return this.start
    }
    get_random_valid_node(){
        return this.node_generator()
    }
    add_node(node){
        this.nodes.push(node)
    }
    add_path(start_node, end_node){
        if(this.is_collision_with_obstacles(start_node,end_node)){
            return false
        }
        end_node.parent = start_node
        this.nodes.push(end_node)
        this.node_paths.push([start_node,end_node])

        for (let i = 0; i<this.goals.length;i++){
            let goal = this.goals[i]
            if(end_node === goal){
                this.solved = true
                break
            }
            if (getDist(goal,end_node)<15 && !(this.is_collision_with_obstacles(end_node,goal))){
                goal.parent = end_node
                this.nodes.push(goal)
                this.node_paths.push([end_node,goal])
                this.solved = true
            }
        }
    }

}