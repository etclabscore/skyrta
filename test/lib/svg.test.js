const Svg = require('../../lib/svg');
var cheerio = require('cheerio');

const testSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <!-- Generated by graphviz version 2.38.0 (20140413.2041)
    -->
    <!-- Title: %3 Pages: 1 -->
    <svg width="73pt" height="116pt"
    viewBox="0.00 0.00 72.99 116.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 112)">
    <title>%3</title>
    <polygon fill="white" stroke="none" points="-4,4 -4,-112 68.9942,-112 68.9942,4 -4,4"/>
    <!-- no -->
    <g id="node1" class="node"><title>no</title>
    <ellipse fill="none" stroke="black" cx="32.4971" cy="-90" rx="27" ry="18"/>
    <text text-anchor="middle" x="32.4971" y="-86.3" font-family="Times,serif" font-size="14.00">no</text>
    </g>
    <!-- power -->
    <g id="node2" class="node"><title>power</title>
    <ellipse fill="none" stroke="black" cx="32.4971" cy="-18" rx="32.4942" ry="18"/>
    <text text-anchor="middle" x="32.4971" y="-14.3" font-family="Times,serif" font-size="14.00">power</text>
    </g>
    <!-- no&#45;&#45;power -->
    <g id="edge1" class="edge"><title>no&#45;&#45;power</title>
    <path fill="none" stroke="black" d="M32.4971,-71.6966C32.4971,-60.8463 32.4971,-46.9167 32.4971,-36.1043"/>
    </g>
    </g>
    </svg>`;

test('data returns original data value', () => {
    let data = '<svg/>';
    let svg = new Svg(data);
    expect(svg.data).toBe(data);
});

test('toEmbed returns just the svg tag', () => {
    let svg = new Svg(testSvg);
    expect(svg.toEmbed()).toMatch(/^<svg[\s\S]*?>[\s\S]*<\/svg>$/m);
});

test('toEmbed returns null if no tag can be matched', () => {
    let svg = new Svg('gibberish');
    expect(svg.toEmbed()).toBeNull();
});

test('option variableSize=true strips width and height', () => {
    let svg = new Svg(testSvg, { variableSize: true });

    const $ = cheerio.load(svg.value, {
        normalizeWhitespace: true,
        xmlMode: true
    });

    let svgNode = $('svg');
    expect(svgNode.attr('height')).toBeUndefined();
    expect(svgNode.attr('width')).toBeUndefined();
});

test('option variableSize=false/undefined keeps width and height', () => {

    let assert = function(target) {
        const $ = cheerio.load(target.value, {
            normalizeWhitespace: true,
            xmlMode: true
        });

        let svgNode = $('svg');
        expect(svgNode.attr('height')).toBeTruthy();
        expect(svgNode.attr('width')).toBeTruthy();
    };

    let svg = new Svg(testSvg, { variableSize: false });
    assert(svg);

    svg =  new Svg(testSvg);
    assert(svg);

    svg =  new Svg(testSvg, { variableSize: undefined });
    assert(svg);
});