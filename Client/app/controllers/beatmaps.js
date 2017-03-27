angular.module('eggplants')
    .controller('LandingController', LandingController);

function LandingController($http, factory) {

    let vm = this;

    /*
    * @description: Gets a list of ranked maps from the Ripple API upon first loading the page
    */
    factory.getIniitalBeatmaps().then((response) =>{ vm.initialBeatmaps = response.data; })


    /*
    * @description: Returns a list of new beatmaps from the Ripple API based on a user's search
    */
    vm.getNewBeatmaps = () => {

        /*
         * Gets data from the form.
         */ 
        let searchQuery = vm.search;
        let rankedStatus = vm.rankedStatus;
        let gameMode = vm.gameMode;
        let keyCount = vm.keyCount;


        factory.getNewBeatmaps(searchQuery, rankedStatus, gameMode).then((response) =>{

            /*
             * Give back a result of null instead of 0 if no data is found.
             * Used to display Error alert message
             */
            if (response.data.Sets == null) {
                vm.newBeatmaps = [];
                return;
            }

            /*
             * If the user chose mania, give back beatmaps only with their selected key count.
             */
            if (gameMode == 3) {

                beatmaps = [];

                response.data.Sets.forEach((beatmap) => {

                    try {
                        for (let i = 0; i <= beatmap.ChildrenBeatmaps2.length; i++) {
                            
                            console.log(beatmap.ChildrenBeatmaps2[i]);
                            if (beatmap.ChildrenBeatmaps2[i].Mode == 3 && beatmap.ChildrenBeatmaps2[i].CS == keyCount) {
                                beatmaps = beatmaps.concat(beatmap);
                                break;
                            }

                        }   
                    } catch (e) {
                        console.log(e);
                    }
  
                });

                /*
                * Return the new beatmaps array
                */
                vm.newBeatmaps = beatmaps;
            /*
             * If the game mode isn't mania, just return all the results.
             */           
            } else {
                vm.newBeatmaps = response.data.Sets;
            }
        });      
    }

  
}    