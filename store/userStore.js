import { defineStore, acceptHMRUpdate } from "pinia";


export const useUserStore = defineStore("userStore", () => {
/*  type user ={
    username : string,
    _id : string,
    _creationTime : number,
    preferences : string[]
  }*/
const user = ref();

const demoResObject = {
  WPM :[25,25,26.2,27,28],
  quality :[90,91,95,94,97],
}




  return {
    user,demoResObject
  };
},
/* Enable this to persist this store : more info : https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html
{
  persist: true}
*/
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
