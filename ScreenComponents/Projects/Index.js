import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import EditForm from "./Edit.js";
import notify from "../../app/notify.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            projects: [],
            createdProject: null,
            // situations: [],
            editFormActive: false,
            // createFormActive: false,
            projectForEditing: {},
            showCompletedProjects: false
        }
    },
    watch: {
        //adds the new project to the projects array when the old createdProject value was null and the new value isnt null
        createdProject: function (newValue, oldValue) {
            if(newValue != null && oldValue == null) {
                this.projects.unshift(newValue);//adds the new project to the projectlist
            }
        }
    },
    computed: {
    },
    components: {
        'EditForm': EditForm,
    },
    methods: {
        assignUpdatedProject(updatedProject) {
            this.projects.forEach((project, index) => {
                if(project.id == updatedProject.id) {
                    if(updatedProject.transformedInProject) {
                        this.projects.splice(index,1); //removes the project from list
                    } else {
                        updatedProject = this.fillReadableDuedate(updatedProject);
                        this.projects[index] = Object.assign({},updatedProject);
                    }
                }
            });
        },
        fillReadableDuedate(project){
                if(project.duedate !== null) {
                    project.readableDuedate = moment(new Date(project.duedate)).format('ddd, MMM Mo YYYY');
                }
                return project;
        },
        fillReadableDuedateArray(projectArray){
            for (let index = 0; index < projectArray.length; index++) {
                projectArray[index] = this.fillReadableDuedate(projectArray[index]);
            }
            return projectArray;
        },
        showEditForm(project){
            this.editFormActive = true;
            this.projectForEditing = project;
        },
        // showCreateForm() {
        //     this.createFormActive = true;
        // },
        loadProjects() {
            this.busy = true;
            const headers = new Headers();
            let requestData = {};

            requestData['url'] = config.serverUrl + "/api/projects";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                json.projects = this.fillReadableDuedateArray(json.projects);
                this.projects = json.projects;
                // this.situations = json.situations;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
                // EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            });
        }
    },
    created () {
        this.loadProjects();
    },
    template: `
    <div class="flexWrapper">
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="mainContainer">

            <h1 class="projectInfo">Projects</h1>
            <!-- <button 
                @click="showCreateForm()"
                class="mt-2 btn btn-primary"
            >New</button> -->
            
            <div class="float-right mt-3 custom-control custom-checkbox mr-sm-2">
                <input type="checkbox" class="custom-control-input" id="showCompletedProjects" v-model="showCompletedProjects">
                <label class="custom-control-label" for="showCompletedProjects">Show completed projects</label>
            </div>
            
            <div class="loader" v-if="busy"></div>

            <div v-else>
                <div class="projectContainer" 
                    v-for="project in projects" :key="project.id"
                    :class="{completedProjectContainer: project.completed}"
                    v-if="!project.completed || (project.completed && showCompletedProjects)"
                >
                    <div>
                        <label class="projectFieldName">Name</label>
                        <div class="projectInfo">{{project.name}}</div>
                    </div>

                    <!-- <div>
                        <label class="projectFieldName">Situation</label>
                        <div class="projectInfo">{{project.situation.situation}}</div>
                    </div> -->

                    <div v-if="project.readableDuedate">
                        <label class="projectFieldName">Due in</label>
                        <div class="projectInfo">{{project.readableDuedate}}</div>
                    </div>

                    <div v-if="project.description">
                        <label class="projectFieldName">Description</label>
                        <div class="projectInfo textareaWhitespacePreWrap">{{project.description}}</div>
                    </div>

                    <button 
                        @click="showEditForm(project)"
                        class="mt-2 btn btn-primary"
                    >edit</button>
                </div>

                <div v-if="projects.length == 0">There is no projects!</div>

                <edit-form 
                    :editFormActive.sync="editFormActive"
                    :project="projectForEditing"
                    v-on:update:project="assignUpdatedProject($event)"
                ></edit-form>
            </div>

            <notice-box></notice-box>
        </div>
    </div>
    `
};