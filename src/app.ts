// https://code.visualstudio.com/docs/typescript/typescript-tutorial
// Cannot find name 'require'. Do you need to install type definitions for node? Try `npm i @types/node` and then add `node` to the types field in your tsconfig.
// Node.js required module
// https://www.npmjs.com/package/bonjour
// https://github.com/mafintosh/multicast-dns#mdns--multicastdnsoptions
// https://www.tutorialsteacher.com/D3js

const ModBonjour = require('bonjour');
const ModClear = require('clear');
const ModCliTable = require('cli-table3');
const ModColors = require('colors');
const ModCytoscape = require('cytoscape');
const ModD3 = require('d3');
const ModElectron = require('electron');
const ModYargs = require('yargs');

import { app } from 'electron';
import ElectronMain from './main';
ElectronMain.Instance().Initialize(app, {
	center: true,
	height: 600,
	icon: './asset/icon-mdns.png',
	width: 800,
});

const multicastdnsOption = {
	interface: '',
	ip: '224.0.0.251', // set the udp ip
	loopback: true, // receive your own packets
	multicast: true, // use udp multicasting
	// interface: '192.168.0.2', // explicitly specify a network interface. defaults to all    port: 5353, // set the udp port
	reuseAddr: true, // set the reuseAddr option when creating the socket (requires node >=0.11.13)
	ttl: 255, // set the multicast ttl
};
ModBonjour(multicastdnsOption);

function someFunction() {
	// console.log('hello qqqqqbha');
	ModD3.select('#p2').style('color', 'red');
}

const appDiv = ModD3.select('#app');
appDiv.innerHTML = `<h1>TypeScript bhq Starter</h1>`;

// advertise an HTTP server on port 3000
ModBonjour.publish({
	host: 'localhost',
	name: 'My Web Server',
	port: 3000,
	protocol: 'tcp',
	subtype: ['bha', '1', '2'],
	txt: { chunky: true, name: 'bacon', strips: 5 },
	type: 'http',
});
// browse for all http services
// Bonjour.find({ type: 'http' }, function (service: any) {
// console.log('Found an HTTP server:', service)
// });

const typeToFind = ModYargs.usage('$0 <cmd> [args]')
	.option('type', {
		alias: 't',
		describe: 'service type, e.g. ipp, http, ssh — defaults to everything',
	})
	.help().argv;

// const typeToFind = '';
const FIELDS = [
	'host',
	'addresses',
	'type',
	'port',
	'protocol',
	'txt',
	'referer',
];
// https://stackoverflow.com/questions/5612787/converting-an-object-to-a-string

function objToString(obj: any) {
	let str = '';
	if (Array.isArray(obj)) {
		for (const p in obj) {
			if (obj.hasOwnProperty(p)) {
				str += ModColors.green(obj[p]) + '\n';
			}
		}
	} else if (typeof obj === 'object' && obj !== null) {
		for (const p in obj) {
			if (obj.hasOwnProperty(p)) {
				str += p + '::' + ModColors.blue(obj[p]) + '\n';
			}
		}
	} else {
		str = ModColors.yellow(obj);
	}
	return str;
}

const detectedDevice: any = {};

function updateTable() {
	ModClear();
	const table = new ModCliTable({
		head: FIELDS,
	});
	Object.keys(detectedDevice).forEach(key => {
		table.push(detectedDevice[key]);
	});
	// console.log(table.toString()); // eslint-disable-line no-console
}

const browser = ModBonjour.find(typeToFind);
browser.on('up', (service: any) => {
	// console.log('%s %s %s', field, typeof field, service[field].toString());

	detectedDevice[service.fqdn] = FIELDS.map(field =>
		objToString(service[field])
	);
	updateTable();
});
browser.on('down', (service: any) => {
	delete detectedDevice[service.fqdn];
	updateTable();
});

// https://bl.ocks.org/Restuta/e4533c4e8c8bbb43fa361a1e1525a3c2

const svg = ModD3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const simulation = ModD3.forceSimulation()
	.force(
		'link',
		ModD3.forceLink().id((d: any) => {
			return d.id;
		})
	)
	// .force("charge", D3.forceManyBody().strength(-200))
	.force(
		'charge',
		ModD3.forceManyBody()
			.strength(-200)
			.theta(0.8)
			.distanceMax(150)
	)
	// 		.force('collide', D3.forceCollide()
	//       .radius(d => 40)
	//       .iterations(2)
	//     )
	.force('center', ModD3.forceCenter(width / 2, height / 2));

const graph = {
	links: [
		{ source: '1', target: '2', value: 1 },
		{ source: '2', target: '4', value: 1 },
		{ source: '4', target: '8', value: 1 },
		{ source: '4', target: '8', value: 1 },
		{ source: '8', target: '16', value: 1 },
		{ source: '16', target: '1', value: 1 },
	],
	nodes: [
		{ id: '1', group: 1 },
		{ id: '2', group: 2 },
		{ id: '4', group: 3 },
		{ id: '8', group: 4 },
		{ id: '16', group: 5 },
		{ id: '11', group: 1 },
		{ id: '12', group: 2 },
		{ id: '14', group: 3 },
		{ id: '18', group: 4 },
		{ id: '116', group: 5 },
	],
};

function run(grf: any) {
	graph.links.forEach((d: any) => {
		//     d.source = d.source_id;
		//     d.target = d.target_id;
	});

	const link = svg
		.append('g')
		.style('stroke', '#aaa')
		.selectAll('line')
		.data(graph.links)
		.enter()
		.append('line');

	const node = svg
		.append('g')
		.attr('class', 'nodes')
		.selectAll('circle')
		.data(graph.nodes)
		.enter()
		.append('circle')
		.attr('r', 2)
		.call(
			ModD3.drag()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended)
		);

	const label = svg
		.append('g')
		.attr('class', 'labels')
		.selectAll('text')
		.data(graph.nodes)
		.enter()
		.append('text')
		.attr('class', 'label')
		.text((d: any) => {
			return d.id;
		});

	simulation.nodes(graph.nodes).on('tick', ticked);

	simulation.force('link').links(graph.links);

	function ticked() {
		link
			.attr('x1', (d: any) => {
				return d.source.x;
			})
			.attr('y1', (d: any) => {
				return d.source.y;
			})
			.attr('x2', (d: any) => {
				return d.target.x;
			})
			.attr('y2', (d: any) => {
				return d.target.y;
			});

		node
			.attr('r', 16)
			.style('fill', '#efefef')
			.style('stroke', '#424242')
			.style('stroke-width', '1px')
			.attr('cx', (d: any) => {
				return d.x + 5;
			})
			.attr('cy', (d: any) => {
				return d.y - 3;
			});

		label
			.attr('x', (d: any) => {
				return d.x;
			})
			.attr('y', (d: any) => {
				return d.y;
			})
			.style('font-size', '10px')
			.style('fill', '#333');
	}
}

function dragstarted(d: any) {
	if (!ModD3.event.active) {
		simulation.alphaTarget(0.3).restart();
	}
	d.fx = d.x;
	d.fy = d.y;
	//  simulation.fix(d);
}

function dragged(d: any) {
	d.fx = ModD3.event.x;
	d.fy = ModD3.event.y;
	//  simulation.fix(d, D3.event.x, D3.event.y);
}

function dragended(d: any) {
	d.fx = ModD3.event.x;
	d.fy = ModD3.event.y;
	if (!ModD3.event.active) {
		simulation.alphaTarget(0);
	}
	// simulation.unfix(d);
}

run(graph);

/*

class Startup {
  public static main(): number {
      console.log('Hello World');
      return 0;
      }
  }
  Startup.main();

var http = require('http');

var server = http.createServer(function(req:any, res:any) {
  res.writeHead(200);
  res.end('Hi everybody!');
  });
  server.listen(8080);
  */

/*

class Startup {
  public static main(): number {
      console.log('Hello World');
      return 0;
      }
  }
  Startup.main();

var http = require('http');

var server = http.createServer(function(req:any, res:any) {
  res.writeHead(200);
  res.end('Hi everybody!');
  });
  server.listen(8080);
  */
// import the module
/*
var Bonjour = require('Bonjour');


var txt_record = {
    name: 'bacon'
    , chunky: true
    , strips: 5
};
var ad = Bonjour.createAdvertisement(Bonjour.tcp('http'), 4321, { txtRecord: txt_record });
ad.start();

// advertise a http server on port 4321
var ad1 = Bonjour.createAdvertisement(Bonjour.tcp('http'), 7890);
ad1.start();

var ad2 = Bonjour.createAdvertisement(Bonjour.udp('http'), 1234);
ad2.start();

// watch all http servers

//var browser = Bonjour.createBrowser(Bonjour.ServiceType.wildcard);  //Bonjour.udp('http'));
// discover all available service types
var browser = Bonjour.browseThemAll();
console.log("browser: ", browser);

browser.on('serviceUp', function (service: any) {
    console.log("service up1: ", JSON.stringify(service, null, 4));
});
browser.on('serviceDown', function (service: any) {
    console.log("service down: ", service);
});
browser.on('serviceChanged', function (service: any) {
    //console.log("service changed0: ", service);
    console.log("service changed1: ", JSON.stringify(service, null, 4));
    //console.log("service interfaceIndex: ", service.interfaceIndex);
    //console.log("service type: ", service.type);
});
browser.on('error', function (error: any, service: any) {
    // console.log("error: ", error);
    console.log("error1: ", JSON.stringify(service, null, 4));
});
browser.start();
*/
// discover all available service types
// var all_the_types = Bonjour.browseThemAll(); // all_the_types is just another browser...
// console.log("all_the_types: ", all_the_types);
/*
function createAdvertisement() {
  var rts:boolean=true;
    // advertise a http server on port 4321
  try {
  const ad = Bonjour.createAdvertisement(Bonjour.tcp('http'), 4321);
  ad.on('error', handleError);
  ad.start();
  } catch (ex) {
    handleError(ex);
    rts=false;
  }
  return rts;
}

function createBrowser():boolean {
  var rts:boolean=true;

  try {
    // watch all http servers
    const browser = Bonjour.createBrowser(Bonjour.tcp('http'));

    browser.on('serviceUp', (service:object) => {
      console.log("service up: ", service);
    });
    browser.on('serviceDown', (service:object) => {
      console.log("service down: ", service);
    });
    browser.start();

    // discover all available service types
    const all_the_types = Bonjour.browseThemAll(); // all_the_types is just another browser...
  } catch (ex) {
  rts=false;
  }
  return rts;
}
function handleError(error:any) {
  switch (error.errorCode) {
    case Bonjour.kDNSServiceErr_Unknown:
      console.warn(error);
      setTimeout(createAdvertisement, 5000);
      break;
    default:
      throw error;
  }
}

if (createAdvertisement())
{
  createBrowser();
}
*/

/*
const createBonjour = require('Bonjour')
const CliTable = require('cli-table2')
const Clear = require('Clear')

const { type } = require('yargs')
  .usage('$0 <cmd> [args]')
  .option('type', {
    alias: 't',
    describe: 'service type, e.g. ipp, http, ssh — defaults to everything',
  })
  .help()
  .argv

const FIELDS = [
  'host',
  'addresses',
  'type',
  'port',
  'protocol',
]


const up = {}

function updateTable() {
  Clear()
  const table = new CliTable({
    head: FIELDS,
  })
  Object.keys(up).forEach((key) => {
    table.push(up[key])
  })
  console.log(table.toString()) // eslint-disable-line no-console
}

const Bonjour = createBonjour()
const browser = Bonjour.find({ type })
browser.on('up', (service) => {
  up[service.fqdn] = FIELDS.map(field => service[field])
  updateTable()
})
browser.on('down', (service) => {
  delete up[service.fqdn]
  updateTable()
})
*/
