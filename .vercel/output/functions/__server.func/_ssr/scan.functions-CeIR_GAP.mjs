import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan.functions-CeIR_GAP.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asInterval(value) {
	if (value === "1h" || value === "4h" || value === "1d") return value;
	throw new Error("بازهٔ زمانی نامعتبر است");
}
var fetchUniverse_createServerFn_handler = createServerRpc({
	id: "53fb8d57274d3c2d88f0307ab58568e9169007938d1eb1d1f88072043457404f",
	name: "fetchUniverse",
	filename: "src/lib/scan.functions.ts"
}, (opts) => fetchUniverse.__executeServer(opts));
var fetchUniverse = createServerFn({ method: "GET" }).handler(fetchUniverse_createServerFn_handler, async () => {
	const { loadUniverse } = await import("./market.server-CPF63yKF.mjs");
	return loadUniverse();
});
var scanPairs_createServerFn_handler = createServerRpc({
	id: "a4676c47a751cbff9608ce281e08c74269dda6fabbe8e7885034e2bbdd7f8b56",
	name: "scanPairs",
	filename: "src/lib/scan.functions.ts"
}, (opts) => scanPairs.__executeServer(opts));
var scanPairs = createServerFn({ method: "POST" }).validator((data) => {
	const interval = asInterval(data?.interval);
	if (!Array.isArray(data?.pairs) || data.pairs.length === 0 || data.pairs.length > 20) throw new Error("دستهٔ نمادها نامعتبر است");
	const pairs = [];
	for (const pair of data.pairs) {
		if (typeof pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(pair)) throw new Error("نماد نامعتبر است");
		pairs.push(pair);
	}
	return {
		interval,
		pairs,
		fresh: Boolean(data.fresh)
	};
}).handler(scanPairs_createServerFn_handler, async ({ data }) => {
	const { scanBatch } = await import("./market.server-CPF63yKF.mjs");
	return scanBatch(data.interval, data.pairs, data.fresh);
});
var fetchChart_createServerFn_handler = createServerRpc({
	id: "dffd19e0021cbfb10f87cfc3f1656d7725f77caec5fb79f89dd9818e756d4dda",
	name: "fetchChart",
	filename: "src/lib/scan.functions.ts"
}, (opts) => fetchChart.__executeServer(opts));
var fetchChart = createServerFn({ method: "POST" }).validator((data) => {
	const interval = asInterval(data?.interval);
	if (typeof data?.pair !== "string" || !/^[A-Z0-9]{2,24}USDT$/.test(data.pair)) throw new Error("نماد نامعتبر است");
	return {
		pair: data.pair,
		interval
	};
}).handler(fetchChart_createServerFn_handler, async ({ data }) => {
	const { loadChart } = await import("./market.server-CPF63yKF.mjs");
	return loadChart(data.pair, data.interval);
});
//#endregion
export { fetchChart_createServerFn_handler, fetchUniverse_createServerFn_handler, scanPairs_createServerFn_handler };
