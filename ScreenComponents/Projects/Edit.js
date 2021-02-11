import notify from "../../app/notify.js";
import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            localProject: null,
        }
    },
    props: ['editFormActive','project'],
    computed: {
    },
    methods: {
        closeModal () {
            this.$emit('update:editFormActive', false);
            this.localProject = null
        },
        assignUpdatedProject(){
            this.$emit('update:project', this.localProject);
        },
        updateProjectSuccess (object) {
            this.busy = false;
            this.assignUpdatedProject();
            this.closeModal();
            notify.notify(object.message,'success');
        },
        updateProject() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const data = {
                'name': this.localProject.name,
                'duedate': this.localProject.duedate,
                'description': this.localProject.description,
            };

            requestData['url'] = config.serverUrl + `/api/projects/${this.localProject.id}`;
            requestData['headers'] = headers;
            requestData['method'] = 'PUT';
            requestData['data'] = data;

            request.fetch(requestData)
            .then(([response,json]) => {
                this.updateProjectSuccess({'message':'Project updated!'});
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        completeProject() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const data = {};

            requestData['url'] = config.serverUrl + `/api/projects/${this.localProject.id}/completeProject/`;
            requestData['headers'] = headers;
            requestData['method'] = 'POST';
            requestData['data'] = data;

            request.fetch(requestData)
            .then(([response,json]) => {
                this.localProject.completed = true;
                this.localProject['message'] = object.message;
                this.updateProjectSuccess(this.localProject);
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        deleteProject() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const data = {};

            requestData['url'] = config.serverUrl + `/api/projects/${this.localProject.id}/`;
            requestData['headers'] = headers;
            requestData['method'] = 'DELETE';
            requestData['data'] = data;

            request.fetch(requestData)
            .then(([response,json]) => {
                this.localProject.completed = true;
                this.localProject['message'] = object.message;
                this.updateProjectSuccess(this.localProject);
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        }
    },
    watch: {
        // whenever editFormActive changes, this function will run
        editFormActive: function (newProp, oldProp) {
            if(newProp && !oldProp) {
                this.localProject = Object.assign({},this.project);
            }
        }
    },
    created () {
        // this.loadInbox();
        this.busy = false;
    },
    template: `
    <div class="flexWrapper editForm modal" v-if="editFormActive">

            <div class="modal_container lg form-group">
                <div class="row">
                    <div class="col">
                        <h2 class="projectInfo">edit form</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <button class="btn btn-success" @click="completeProject()">Complete project</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <label for="name">Name</label>
                        <input name="name" class="form-control" type="text" placeholder="name" v-model="localProject.name" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <label for="duedate">Due in</label>
                        <input name="duedate" class="form-control" type="date" placeholder="duedate" v-model="localProject.duedate" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <label for="description">Description</label>
                        <textarea name="description" class="form-control" rows="3" v-model="localProject.description"></textarea>
                    </div>
                </div>

                <button class="btn btn-danger" @click="closeModal()">Cancel</button>
                <button class="btn btn-success" @click="updateProject()">Save</button>

                <div class="loader" v-if="busy"></div>
            </div>

    </div>
    `
};