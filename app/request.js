import config from "../../app/config.js";
import EventBus from "../app/EventBus.js";

export default {

    fetch(params){
        const data = JSON.stringify(params.data);
        params.method = params.method !== undefined ? params.method : 'GET'
        params.headers.append("Authorization", window.localStorage.sRegisterToken);
        if(params.method == 'POST' || params.method == 'PUT')
            params.headers.append('Content-Type','application/json');

        return new Promise((resolve, reject) => {
            try {
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data
                })
                .then( (response) => {
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            resolve([response,json]);
                        } else {
                            //TRY TOKEN REFRESH
                            if(response.status == 401){
                                this.refreshToken().then((responseData) => {
                                    //TOKEN REFRESH SUCCESS, REPEAT REQUEST
                                    this.requestRepeat(params)
                                    .then(([response,json]) => {
                                        resolve([response,json]);
                                    });
                                }).catch((error) => {
                                    //TOKEN REFRESH ERROR, QUIT
                                    // console.log(error);
                                    EventBus.$emit('action','logout');
                                    reject(error);
                                });
                            } else {
                                //ELSE, THATS A REQUEST ERROR
                                // console.log(json.message);
                                reject(json.message);
                            }
                        }
                    })
                })
            } catch (error) {
                //NETWORK ERROR
                // console.log(error);
                reject(error);
            }
        });
    },
    
    refreshToken(){
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const data = JSON.stringify({
            'refresh_token': window.localStorage.sRegisterRefreshToken,
            'token': window.localStorage.sRegisterToken
        });
        return new Promise((resolve, reject) => {
            try {
                fetch(config.serverUrl + "/auth/refreshToken",{
                    headers: headers,
                    method: "POST",
                    body: data
                })
                .then( (response) => {
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            window.localStorage.sRegisterToken = json.token;
                            window.localStorage.sRegisterRefreshToken = json.refresh_token;
                            resolve({response,json});
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message);
                        }
                    })
                })
            } catch (error) {
                //NETWORK ERROR
                // console.log(error);
                reject(error);
            }
        });
    },
    
    requestRepeat(params){
        const data = JSON.stringify(params.data);
        params.method = params.method !== undefined ? params.method : 'GET';
        // params.headers.delete('Authorization');
        params.headers.set("Authorization", window.localStorage.sRegisterToken);
        if(params.method == 'POST' || params.method == 'PUT') {
            debugger
            params.headers.append('Content-Type','application/json');
        }

        return new Promise((resolve, reject) => {
            try {
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data
                })
                .then( (response) => {
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            resolve([response,json]);
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message);
                        }
                    })
                })
            } catch (error) {
                //NETWORK ERROR
                // console.log(error);
                reject(error);
            }
        });
    }
};