import { distanceBetween } from './utils';

function DFSGraph () {
    this.graph = {};
}

DFSGraph.prototype.init = function(lines, stations) {
    Object.keys(lines).forEach((line) => {
        lines[line].route.forEach((station, idx) => {
            if (typeof this.graph[station] === 'undefined') {
                this.graph[station] = {};
            }
            if (idx > 0) {
                const prevStation = lines[line].route[idx - 1];
                this.graph[station][prevStation] = distanceBetween(stations[station].lat, stations[station].lng, stations[prevStation].lat, stations[prevStation].lng);
            }
            if (idx + 1 < lines[line].route.length) {
                const nextStation = lines[line].route[idx + 1];
                this.graph[station][nextStation] = distanceBetween(stations[station].lat, stations[station].lng, stations[nextStation].lat, stations[nextStation].lng);
            }
        });
    });
};

DFSGraph.prototype.findAllPaths = function(s, d) {
    const paths = [];
    const path = [];
    const visited = {};
    const dfs = (s, d, v, p) => {
        v[s] = true;
        p.push(s);
        if (s === d) {
            paths.push(p.toString().split(','));
        } else {
            Object.keys(this.graph[s]).forEach((adj) => {
                if (visited[adj] !== true) {
                    dfs(adj, d, v, p);
                }
            });
        }
        p.pop();
        v[s] = false;
    };
    dfs(s, d, visited, path);
    paths.sort((a, b) => {
        return a.length - b.length;
    });
    return paths;
};

/*
DFSGraph.prototype.findAllPathBfs = function(s, d) {
    var paths = [];
    const path = [];
    const bfs = (s, d, p) => {
        const queue = [];
        Object.keys(this.graph[s]).forEach((adj) => {
            paths.forEach((path) => {
                if (path.indexOf(adj) === -1) {
                    path.push(adj);
                }
            });
            djf
        });
    };
    bfs(s, d, []);
    paths.sort((a, b) => {
        return a.length - b.length;
    });
    return paths;
};
*/

export default DFSGraph;
