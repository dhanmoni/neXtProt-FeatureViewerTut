// var ft = new FeatureViewer('MALWMRLLPLLALLALWGPGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLE',
//                            '#fv1',
//                             {
//                                 showAxis: true,
//                                 showSequence: true,
//                                 brushActive: true, //zoom
//                                 toolbar:true, //current zoom & mouse position
//                                 bubbleHelp:true, 
//                                 zoomMax:50 //define the maximum range of the zoom
//                             });
// ft.addFeature({
//   data: [{x:20,y:32},{x:46,y:100},{x:123,y:167}],
//   name: "test feature 1",
//   className: "test1", //can be used for styling
//   color: "#0F8292",
//   type: "rect" // ['rect', 'path', 'line']
// });

const loader = document.getElementById('loader');
loader.style.visibility = 'hidden';

const select_chromosome = document.getElementById('chromosome-select');
const select_accession = document.getElementById('accession-select');
const search_accession = document.getElementById('search_accession');
const search_button = document.getElementById('search_button');
const details = document.getElementById('details');

const chromosome_url = 'https://api.nextprot.org/chromosomes.json';

const next_button1 = document.getElementById('next1');
const next_button2 = document.getElementById('next2');

next_button2.disabled = true;
select_accession.disabled = true;
next_button1.disabled = true;
select_chromosome.disabled = true;

//List chromosomes 
fetch(chromosome_url)
  .then((resp) => {
  return resp.json()
  })
  .then((data)=> {
    return data.map((chromosome, index) => {
      select_chromosome.options[select_chromosome.options.length] = new Option(chromosome, chromosome);
    })
  })
  .then(()=> {
    next_button1.disabled = false;
    select_chromosome.disabled = false;
  })
  .catch((error)=> {
    console.log(error);
});

//Get accession from the selected chromosome

const chromosomeSelected = ()=> {
  loader.style.visibility = 'visible';
  const curr = select_chromosome.options[select_chromosome.selectedIndex].text;
  const accession_url = `https://api.nextprot.org/entry-accessions/chromosome/${curr}.json`

  select_chromosome.disabled = true;
  next_button1.disabled = true;
  search_accession.disabled = true;
  search_button.disabled = true;
    
  fetch(accession_url)
    .then((resp) => {
      return resp.json()
    })
    .then((data) => {
      console.log(data);
      return data.map((accession, index) => {
        select_accession.options[select_accession.options.length] = new Option(accession, accession);
      })
    }).then(()=> {
      next_button2.disabled = false;
      select_accession.disabled = false;
      loader.style.visibility = 'hidden';
    })
    .catch((error)=> {
      console.log(error);
    });
}


const accessionSelected = ()=> {
  const curr = select_accession.options[select_accession.selectedIndex].text;
  
  select_accession.disabled = true;
  next_button2.disabled = true;
  loader.style.visibility = 'visible';
  getFeatureViewer(curr);
  

}

const searchAccession = ()=> {
  const curr = search_accession.value;
  console.log(curr)
  loader.style.visibility = 'visible';
  select_chromosome.disabled = true;
  next_button1.disabled = true;
  getFeatureViewer(curr);
}

const reset = ()=> {
  location.reload()
}


const getFeatureViewer = (url_data)=> {
  const applicationName = 'Testing neXtProt API with FeatureViewer'; //please provide a name for your application
  const clientInfo='Dhanmoni Nath - GSOC student'; //please provide some information about you
  const nx = new Nextprot.Client(applicationName, clientInfo);
          
  let isoform = url_data;

  // feature viewer options
  const options = {showAxis: true, showSequence: true,
  brushActive: true, toolbar:true,
  bubbleHelp: true, zoomMax:20 };

  // Create nextprot feature viewer
  nxFeatureViewer(nx, isoform, "#fv2", options).then(function(ff){
  // Add feature from nextprot
  const styles = [
    {name: "Propeptide",className: "pro",color: "#B3B3B3",type: "rect",filter:"Processing"}, 
    {name: "Mature protein",className: "mat",color: "#B3B3C2",type: "rect",filter:"Processing"},
    {name: "Variant",className: "variant",color: "rgba(0,255,154,0.3)",type: "unique",filter:"Variant"},
    {name: "Disulfide bond",className: "dsB",color: "#B3B3E1",type: "path",filter:"Modified Residue"},
  ]; 
  
  ff.addNxFeature(["propeptide","mature-protein", "variant","disulfide-bond"], styles)}).then(()=> {
    loader.style.visibility = 'hidden';
  })
}

