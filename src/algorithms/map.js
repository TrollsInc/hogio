import {Node, getDist,isZero,onSegment,getOrientation,intersects} from "./utils"
const obs = [[[10, 15], [17.5, 12.5], [15, 5], [7.5, 7.5]],
    [[35, 42.5], [37.5, 35], [30, 32.5], [27.5, 40]],
    [[40, 10], [50, 10], [50, 0], [40, 0]]]
class Map{

    constructor(exploration_mode) {
        this.width = 65
        this.height = 45
        this.start = new Node([3.7,3.7],null)
        this.goals = [new Node([61.2, 41.2],null)]

        this.obstacles = []
        for(let i=0; i<obs.length;i++){
            let obstacle = obs[i]
            let nodeList = []
            for(let k = 0;k<obstacle.length;k++){
                nodeList.push(new Node(obstacle[k],null))
            }
            this.obstacles.push(nodeList)
        }
        this.nodes = []
        this.node_paths = []
        this.solved = false
        this.smooth_path = []
        this.smoothed = false
        this.exploration_mode = exploration_mode
        this.explored_obstacles = []
    }
    is_inbound(node) {
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
            for(let index = 0; index<num_sides; index++){
                let side_start = obstacle[index]
                let side_end = obstacle[(index + 1) % num_sides]
                if (intersects(line_start, line_end, side_start, side_end)){
                    return true
                }
            }
        }
        return false
    }

    is_inside_obstacles(node, use_all_obstacles){
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
                let orientation = getOrientation(side_start, side_end, node)
                if (orientation===2){
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
        if(this.is_collision_with_obstacles([start_node,end_node])){
            return false
        }
        end_node.setParent(start_node)
        this.nodes.push(end_node)
        this.node_paths.push([start_node,end_node])

        for (let i = 0; i<this.goals.length;i++){
            let goal = this.goals[i]
            if(end_node === goal){
                this.solved = true
                break
            }
            if (getDist(goal,end_node)<1.5 && !(this.is_collision_with_obstacles([end_node,goal]))){
                goal.setParent(end_node)
                this.nodes.push(goal)
                this.node_paths.push([end_node,goal])
                this.solved = true
                break
            }
        }
    }

    is_solved(){
        return this.solved
    }
    is_solution_valid(){
        if(!this.solved){
            return false
        }
        let curr = null
        for(let i =0;i<this.goals.length;i++){
            curr = this.goals[i]
            while(curr.getParent()!==null){
                curr = curr.getParent()
            }
            if(curr===this.start){
                return true
            }
        }
        return false
    }

    step_from_to(node0, node1, limit=7.5){
        let dist = getDist(node0,node1)
        if(dist>limit){
            const diffx = node1.getX()-node0.getX()
            const diffy = node1.getY()-node0.getY()
            const angle = Math.atan2(diffy,diffx)
            let vectorx = limit*Math.cos(angle)
            let vectory = limit*Math.sin(angle)
            return new Node([node0.getX()+vectorx,node0.getY()+vectory],null)
        }
        return node1
    }

    node_generator(){
        let rand_node = null
        while(rand_node == null){
            let rand_x = Math.floor(Math.random()*(this.width+1))
            let rand_y = Math.floor(Math.random()*(this.height+1))

            rand_node = new Node([rand_x,rand_y],null)
            if(Math.random()<0.05){
                rand_node = this.get_goals()[0]
                break
            }
            if(!this.is_inbound(rand_node) || this.is_inside_obstacles(rand_node,true)){
                rand_node = null
            }
        }
        return rand_node
    }
    get_smoothed_path(){
        if(this.smoothed){
            return this.smooth_path
        }
        this.smooth_path = this.compute_smooth_path(this.get_path())
        this.smoothed = true
        return this.smooth_path
    }
    compute_smooth_path(path){
        for(let i=0;i<2*path.length;i++){
            let point1 = Math.floor(Math.random()*(path.length))
            let point2 = Math.floor(Math.random()*(path.length))
            let idx1 = Math.min(point1, point2)
            let idx2 = Math.max(point1, point2)
            if (idx1 !== idx2) {
                let node1= path[idx1]
                let node2 = path[idx2]
                if(!this.is_collision_with_obstacles([node1,node2])){
                    node2.setParent(node1)
                    path = path.slice(0,idx1+1).concat(path.slice(idx2,path.length))
                }
            }
        }
        return path
    }
    get_path(){
        let final_path = null
        while(final_path == null){
            let path = []
            let curr = null
            for(let i = 0;i<this.goals.length;i++){
                curr = this.goals[i]
                while(curr.getParent() != null){
                    path.push(curr)
                    curr = curr.getParent()
                }
                if(curr===this.start) {
                    path.push(curr)
                    break
                }
            }
            final_path = path.reverse()
        }
        return final_path
    }
    clear_smooth_path(){
        this.smoothed = false
        this.smooth_path = []
    }
    clear_nodes(){
        this.node_paths = []
    }
    clear_goals(){
        this.goals = []
    }
    clear_obstacles(){
        this.obstacles = []
    }
    check_new_obstacles(robot,vision_distance){
        let has_new_obstacle = false
        for(let i=0;i<this.obstacles.length;i++){
            let obstacle = this.obstacles[i]
            if(this.explored_obstacles.indexOf(obstacle)===-1){
                if(this.distance_to_obstacle(robot,obstacle)<=vision_distance){
                    this.explored_obstacles.push(obstacle)
                    has_new_obstacle = true
                }
            }
        }
        return has_new_obstacle
    }
    distance_to_obstacle(robot,obstacle){
        let x = robot.getX()
        let y = robot.getY()
        let x1 = obstacle[0].getX()
        let y1 = obstacle[0].getY()
        let x2 = obstacle[2].getX()
        let y2 = obstacle[2].getY()
        x1 = Math.min(x1, x2)
        x2 = Math.max(x1, x2)
        y1 = Math.min(y1, y2)
        y2 = Math.max(y1, y2)

        let distances = []
        if(x1 < x < x2 && y1 < y < y2){
            return 0
        }
        if(x1 < x < x2){
            distances.push(Math.min(Math.abs(y - y1), Math.abs(y - y2)))
        }
        if(y1 < y < y2){
            distances.push(Math.min(Math.abs(x - x1), Math.abs(x - x2)))
        }
        for (let i =0; i<obstacle.length;i++){
            let corner = obstacle[i]
            let bx = corner.getX()
            let by = corner.getY()
            distances.push(Math.sqrt((x - bx)^2 + (y - by)^2))
        }
        return Math.min(...distances)
    }
}

export {Map}