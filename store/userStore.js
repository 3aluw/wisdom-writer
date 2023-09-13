import { defineStore, acceptHMRUpdate } from "pinia";


export const useUserStore = defineStore("userStore", () => {
const user = ref();




  return {
    user
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
