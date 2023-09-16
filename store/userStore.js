import { defineStore, acceptHMRUpdate } from "pinia";


export const useUserStore = defineStore("userStore", () => {
const user = ref();

const demoObject = {
  CPM :[25,25,26.2,27],
  quality :[90,91,95,94],
}




  return {
    user,demoObject
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
