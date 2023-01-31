const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

// add data variable
let countyData
let educationData

// const h = 800;
// const w = 1500;
// const p = 20;

let geomap = d3.select('#geomap')
let tooltip = d3.select('#tooltip')

// function colorize(item){
//     if (item<=14.5){console.log('#E0B1CB')}
//     else if(item<=29){console.log('#BE95C4')}
//     else if(item<=43.5){console.log('#9F86C0')}
//     else if(item<=58){console.log('#5E548E')}
//     else {console.log('#231942')}
// }

// function colorize(item){
//     if (item<=14.5){return 'grey'}
//     else if(item<=29){return 'lightgrey'}
//     else if(item<=43.5){return 'lightpink'}
//     else if(item<=58){return 'salmon'}
//     else {return 'red'}
// }



let drawMap = () => {
    geomap.selectAll('path') //each line of the map is a path of svg
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (item) => {
            //find the county zip in county data
            let countyZip = item.id;

            //find the education zip to match with county data, like inner join
            let edCounty = educationData.find((item) => {
               return item['fips'] === countyZip
            })
            
            let percentage = edCounty['bachelorsOrHigher'];
            //?colorize(percentage);
            if (percentage<=14.5){return '#E0E1DD'}
            else if(percentage<=29){return '#778DA9'}
            else if(percentage<=43.5){return '#415A77'}
            else if(percentage<=58){return '#1B263B'}
            else {return '#0D1B2A'}
            })
            .attr('data-fips', (item) => {
                return item.id
            })
            .attr('data-education', (item) => {
                let countyZip = item.id;

                let edCounty = educationData.find((item) => {
                    return item['fips'] = countyZip})
                
                let percentage = edCounty['bachelorsOrHigher'];
                return percentage
            })
            .on('mouseover', (item) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                let countyZip = item.currentTarget.__data__.id;
                let edCounty = educationData.find((item) => {
                        return item['fips'] === countyZip
                })   

               // let percentage = edCounty['bachelorsOrHigher']
                
                tooltip.html( 
                    'Zip code: '+ `${edCounty['fips']}` + ' '+
                            'Area: '+ edCounty['area_name'] +' ' +
                            'State: ' + edCounty['state']+ ' '+
                            'Bachelors or higher: '+edCounty['bachelorsOrHigher']+'%'
                            )

            })
            .on('mouseout', (item) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })
}   




//fetch eudcation raw data
d3.json(countyURL).then(
    (data, error) => {
        if (error){console.log(log)
        }else{
        //use topojsons.feature to convert topology data into geoJSON data.
        //In console,  type has changed from Topology into featureCollection.
        //Id in the array will match Fips in Eudcation data, basically doning a inner join gives us all the info for mapping
        countyData = topojson.feature(data, data.objects.counties).features
        console.log(countyData)

    // fetch education data
    d3.json(educationURL).then( 
        (data, error) => {
            if (error){console.log(log)}
            else {
                educationData = data;
                console.log(educationData);

                // let arr = [];
                // for (let item of educationData){
                   
                //     arr.push(item['bachelorsOrHigher'])
                    
                // }
                // console.log(arr); 
                // console.log(Math.max(...arr));
                // console.log(Math.min(...arr));
                // console.log((Math.max(...arr)-Math.min(...arr))/5)

               
                //
                // (item)=>{
                //     let eg = educationData[item]
                //     console.log(eg)
                // };   
                //colorize();
                // once data is ready, draw the map
                drawMap();
            }
    })
}
})