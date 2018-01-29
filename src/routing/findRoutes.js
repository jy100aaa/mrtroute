import { stations, lines } from './mrt.json';
import { distanceBetween } from './utils';
import DFSGraph from './dfsGraph';
/*
	Returns the best routes between the origin and destination.

	Arguments origin and destination are { lat, lng } objects.
	Returns an array of the best routes. You may define "best" using any reasonable metric and document your definition.

	Each route is an object which must contain a "steps" array. You may add additional properties as needed.
	Each step can represent a "walk", "ride" or "change", and must have at least the following properties:
	- { type: "walk", from: <stationId> or "origin", to: <stationId> or "destination" }
	- { type: "ride", line: <lineId>, from: <stationId>, to: <stationId> }
	- { type: "change", station: <stationId>, from: <lineId>, to: <lineId> }
	You may add additional properties as needed.

	Example:

	findRoutes({ lat: 1.322522, lng: 103.815403 }, { lat: 1.29321, lng: 103.852216 })

	should return something like:

	[
		{ steps: [
			{ type: "walk", from: "origin", to: "botanic_gardens" },
			{ type: "ride", line: "CC", from: "botanic_gardens", to: "buona_vista" },
			{ type: "change", station: "buona_vista", from: "CC", to: "EW" },
			{ type: "ride", line: "EW", from: "buona_vista", to: "bugis" },
			{ type: "walk", from: "bugis", to: "destination" }
		] },
		{ steps: [
			// worse route
		] }
	]

*/

const dfsGraph = new DFSGraph();
dfsGraph.init(lines, stations);

export default function findRoutes(origin, destination) {
    const getClosestStation = (coord) => {
        let d = 1000000; // large enough distance in meters to cover from end to end distance of Singapore
        let sta = {};
        Object.keys(stations).forEach((key) => {
            const station = stations[key];
            let distance = distanceBetween(station.lat, station.lng, coord.lat, coord.lng);
            if (distance < d) {
                Object.assign(sta, station, {routeName: key});
                d = distance;
            }

        });
        return sta;
    };
    const getStationByRouteName = (routeName) => {
        let sta = {};
        Object.keys(stations).forEach((key) => {
            if (routeName === key) {
                Object.assign(sta, stations[key], {routeName: key});
            }
        });
        return sta;
    };
    const getLines = (routeName) => {
        const lineName = [];
        Object.keys(lines).forEach((key) => {
            if (lines[key].route.indexOf(routeName) !== -1) {
                lineName.push(key);
            }
        });
        return lineName;
    };
    const getRoute = (path, origin, destination) => {
        if (path.length < 2) {
            return;
        }
        const startStation = getStationByRouteName(path[0]);
        const endStation = getStationByRouteName(path[path.length - 1]);
        let currentFrom = getStationByRouteName(path[0]);
        const steps = [];
        let stops = 0;
        let linePath = [];
        let currentLine = '';
        for (let i = 0; i < path.length; i++) {
            linePath.push(getLines(path[i]));
        }
        linePath[0].forEach((l) => {
            if (linePath[1].indexOf(l) !== -1) {
                currentLine = l;
            }
        });
        steps.push({
            type: 'walk',
            from: 'origin',
            to: startStation.name,
            distance: distanceBetween(origin.lat, origin.lng, startStation.lat, startStation.lng)
        });
        for (let i = 0; i < linePath.length - 1; i++) {
            const current = linePath[i];
            const next = linePath[i + 1];
            if (next.indexOf(currentLine) === -1) {
                const changeStation = getStationByRouteName(path[i]);
                const prevLine = currentLine;
                steps.push({
                    type: 'ride',
                    line: currentLine,
                    stops: stops,
                    from: currentFrom.name,
                    to: changeStation.name
                });
                currentFrom = changeStation;
                if (next.length === 1) {
                    currentLine = next[0];
                } else {
                    if (i < linePath.length - 2) {
                        const afterNext = linePath[i + 2];
                        let found = false;
                        for (let j = 0; j < afterNext.length; j++) {
                            for (let k = 0; k < next.length; k++) {
                                if (next[k] === afterNext[j]) {
                                    currentLine = next[k];
                                    found = true;
                                    break;
                                }
                            }
                            if (found) {
                                break;
                            }
                        }
                    } else {
                        let found = false;
                        for (let j = 0; j < next.length; j++) {
                            for (let k = 0; k < current.length; k++) {
                                if (next[j] === current[k]) {
                                    currentLine = next[j];
                                    found = true;
                                    break;
                                }
                                if (found) {
                                    break;
                                }
                            }
                        }
                    }
                }
                steps.push({
                    type: 'change',
                    station: changeStation.name,
                    from: prevLine,
                    to: currentLine
                });
                stops = 1;
            } else {
                stops += 1;
            }
        }
        steps.push({
            type: 'ride',
            line: currentLine,
            stops: stops,
            from: currentFrom.name,
            to: endStation.name
        });

        steps.push({
            type: 'walk',
            from: endStation.name,
            to: 'destination',
            distance: distanceBetween(destination.lat, destination.lng, endStation.lat, endStation.lng)
        });

        return steps;
    };

    const ret = [];
    const distanceBetweenOriginAndDestination = distanceBetween(origin.lat, origin.lng, destination.lat, destination.lng);
    const closestStationFromOrigin = getClosestStation(origin);
    const closestStationFromDestination = getClosestStation(destination);

    // if it is less than or equal to 0.5KM, better walk from origin to destination
    if (closestStationFromOrigin.name === closestStationFromDestination.name || distanceBetweenOriginAndDestination <= 500) {
        ret.push({
            steps: [
                {
                    type: 'walk',
                    from: 'origin',
                    to: 'destination',
                    distance: distanceBetweenOriginAndDestination
                }
            ]
        });
    } else {
        const paths = dfsGraph.findAllPaths(closestStationFromOrigin.routeName, closestStationFromDestination.routeName);
        //const paths = dfsGraph.findAllPathBfs(closestStationFromOrigin.routeName, closestStationFromDestination.routeName);
        // suggest upto three routes
        for (let i = 0; i < 3 && i < paths.length; i++) {
            ret.push({
                steps: getRoute(paths[i], origin, destination)
            });
        }
    }
    return ret;
}
