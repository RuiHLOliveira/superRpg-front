import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import EditForm from "./Edit.js";
import CreateForm from "./Create.js";
import notify from "../../app/notify.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            tasks: [],
            createdTask: null,
            situations: [],
            editFormActive: false,
            createFormActive: false,
            taskForEditing: {},
            showCompletedTasks: false
        }
    },
    watch: {
        //adds the new task to the tasks array when the old createdTask value was null and the new value isnt null
        createdTask: function (newValue, oldValue) {
            if(newValue != null && oldValue == null) {
                this.tasks.unshift(newValue);//adds the new task to the tasklist
            }
        }
    },
    computed: {
    },
    components: {
        'EditForm': EditForm,
        'CreateForm': CreateForm
    },
    methods: {
        assignUpdatedTask(updatedTask) {
            this.tasks.forEach((task, index) => {
                if(task.id == updatedTask.id) {
                    if(updatedTask.transformedInProject) {
                        this.tasks.splice(index,1); //removes the task from list
                    } else {
                        updatedTask = this.fillReadableDuedate(updatedTask);
                        this.tasks[index] = Object.assign({},updatedTask);
                    }
                }
            });
        },
        fillReadableDuedate(task){
                if(task.duedate !== null) {
                    task.readableDuedate = moment(new Date(task.duedate)).format('ddd, MMM Mo YYYY');
                }
                return task;
        },
        fillReadableDuedateArray(taskArray){
            for (let index = 0; index < taskArray.length; index++) {
                taskArray[index] = this.fillReadableDuedate(taskArray[index]);
            }
            return taskArray;
        },
        showEditForm(task){
            this.editFormActive = true;
            this.taskForEditing = task;
        },
        showCreateForm() {
            this.createFormActive = true;
        },
        loadTasks() {
            this.busy = true;
            const headers = new Headers();
            let requestData = {};
            headers.append("Authorization", window.localStorage.sRegisterToken);

            requestData['url'] = config.serverUrl + "/api/tasks";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                json.tasks = this.fillReadableDuedateArray(json.tasks);
                this.tasks = json.tasks;
                this.situations = json.situations;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
                // EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            });

        }
    },
    created () {
        this.loadTasks();
    },
    template: `
    <div class="flexWrapper">
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="mainContainer">

            <h1 class="taskInfo">Inbox</h1>
            <button 
                @click="showCreateForm()"
                class="mt-2 btn btn-primary"
            >New</button>
            
            <div class="float-right mt-3 custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" id="showCompletedTasks" v-model="showCompletedTasks">
                <label class="custom-control-label" for="showCompletedTasks">Show completed tasks</label>
            </div>
            
            <div class="loader" v-if="busy"></div>

            <div v-else>
                <div class="taskContainer" 
                    v-for="task in tasks" :key="task.id"
                    :class="{completedTaskContainer: task.completed}"
                    v-if="!task.completed || (task.completed && showCompletedTasks)"
                >
                    <div>
                        <label class="taskFieldName">Name</label>
                        <div class="taskInfo">{{task.name}}</div>
                    </div>

                    <div>
                        <label class="taskFieldName">Situation</label>
                        <div class="taskInfo">{{task.situation.situation}}</div>
                    </div>

                    <div v-if="task.readableDuedate">
                        <label class="taskFieldName">Due in</label>
                        <div class="taskInfo">{{task.readableDuedate}}</div>
                    </div>

                    <div v-if="task.description">
                        <label class="taskFieldName">Description</label>
                        <div class="taskInfo textareaWhitespacePreWrap">{{task.description}}</div>
                    </div>

                    <button 
                        @click="showEditForm(task)"
                        class="mt-2 btn btn-primary"
                    >edit</button>
                </div>

                <div v-if="tasks.length == 0">There is no tasks!</div>

                <create-form 
                    :createFormActive.sync="createFormActive"
                    :createdTask.sync="createdTask"
                ></create-form>

                <edit-form 
                    :editFormActive.sync="editFormActive"
                    :task="taskForEditing"
                    v-on:update:task="assignUpdatedTask($event)"
                    :situations="situations"
                ></edit-form>
            </div>

            <notice-box></notice-box>
        </div>
    </div>
    `
};