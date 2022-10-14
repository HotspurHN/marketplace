const fs = require('fs');
const ipfsAPI = require('ipfs-api');
import "dotenv/config";

const images: { file: { path: string, content: Buffer }, jsonFile: { description: string, image: string, name: string, attributes: { trait_type: string, value: string }[] } }[] = [];

//const INFURA_IPFS_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID || '';
//const INFURA_IPFS_SECRET_KEY = process.env.INFURA_IPFS_SECRET_KEY || '';
//const auth = 'Basic ' + Buffer.from(`${INFURA_IPFS_PROJECT_ID}:${INFURA_IPFS_SECRET_KEY}`).toString('base64');

const ipfs = ipfsAPI('localhost', '5001');

const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
<g>
 <rect height="100" width="100" y="0" x="0" fill="{0}"/>
 <rect stroke="#000" height="44.07895" width="75" y="55.98684" x="14.80263" fill="{1}"/>
 <ellipse stroke="#000" ry="40" rx="41.77632" cy="51.8421" cx="56.25" fill="{2}"/>
 <ellipse ry="33" rx="33.22368" cy="57.5" cx="63.1579" stroke="#000" fill="{3}"/>
   {4}
   {5}
   {6}
   {7}
</g>
</svg>`;

const eyes = [`<ellipse ry="5.59211" rx="5.75658" cy="52.56579" cx="51.15132" stroke="#000" fill="#ffffff"/>
<ellipse ry="5.59211" rx="5.75658" cy="52.89473" cx="82.40132" stroke="#000" fill="#ffffff"/>
<ellipse ry="3" rx="2.79605" cy="53.84868" cx="52.79605" stroke="#000" fill="{0}"/>
<ellipse ry="3" rx="2.79605" cy="54.17763" cx="83.7171" stroke="#000" fill="{0}"/>`,
    `<path stroke="#000" d="m51.80958,49.27793c3.4584,-8.62175 17.00851,0 0,11.0851c-17.00851,-11.0851 -3.4584,-19.70685 0,-11.0851z" fill="{0}"/>
    <path stroke="#000" d="m82.40169,49.60688c3.4584,-8.62175 17.00852,0 0,11.0851c-17.00851,-11.0851 -3.4584,-19.70685 0,-11.0851z" fill="{0}"/>`];

const mouth = [`<rect height="4.93421" width="42.10526" y="69.14474" x="45.06579" stroke="#000" fill="#ff9b9b"/>`, `<path transform="rotate(-91.8418 66.4233 71.517)" id="svg_19" d="m73.66016,91.08934l0,0c-7.99289,0 -14.47368,-8.76131 -14.47368,-19.57237c0,-10.80968 6.4808,-19.57237 14.47368,-19.57237l0,0c-4.55515,4.62025 -7.23635,11.87195 -7.23635,19.57237s2.6812,14.95073 7.23635,19.57237z" stroke="#000" fill="{0}"/>`, `<path transform="rotate(92.2678 66.4233 73.6551)" stroke="#000" d="m70.21303,93.1118l0,0c-4.18567,0 -7.57949,-8.70951 -7.57949,-19.45665c0,-10.74577 3.39382,-19.45665 7.57949,-19.45665l0,0c-2.38541,4.59293 -3.78949,11.80176 -3.78949,19.45665s1.40407,14.86233 3.78949,19.45665z" fill="{0}"/>`];

const mask = [``, `<path stroke="#000" d="m41.56585,77.02366l4.65853,-15.66426l18.86116,-6.97126l18.86117,6.97126l4.65861,15.66426l-13.05271,12.56184l-20.93415,0l-13.05262,-12.56184z" fill="{0}"/>`];

const addons = [`<path transform="rotate(32.5929 83.0456 14.1916)" stroke="#000" d="m92.25251,7.931c-0.0858,-2.97957 -3.0786,-5.37371 -6.75967,-5.37523c-2.46027,0.00076 -4.60903,1.07216 -5.78974,2.67053c-0.55491,-0.2483 -1.19376,-0.39257 -1.87458,-0.39257c-2.12545,0.00152 -3.85454,1.37133 -3.93195,3.08739c-2.23177,0.59683 -3.84708,2.29694 -3.84894,4.31749c0,2.51487 2.50596,4.55592 5.59575,4.55592l0,-0.00152l4.91587,0l-2.02007,2.58017l1.8438,-0.31208l-2.46586,6.7663l8.52233,-7.67065l-1.99395,0.17237l2.021,-1.5361l3.98138,0c3.08886,0 5.59575,-2.04105 5.59575,-4.55592c-0.00187,-2.00233 -1.58919,-3.69561 -3.79112,-4.3061zm-1.80463,7.3449l-14.80543,0c-2.06017,-0.00456 -3.7277,-1.3607 -3.73143,-3.03804c-0.00187,-1.50497 1.35231,-2.74722 3.12429,-2.98489c0.24715,-0.03265 0.46818,-0.14503 0.61273,-0.31436c0.14456,-0.16933 0.19772,-0.37738 0.15202,-0.57936c-0.02611,-0.11238 -0.04197,-0.21868 -0.04197,-0.32195c0.00373,-0.93017 0.92796,-1.68265 2.07043,-1.68417c0.60341,0 1.13501,0.21109 1.52298,0.55506c0.2173,0.19515 0.54745,0.28474 0.86454,0.23463c0.31896,-0.05012 0.58382,-0.23311 0.6976,-0.47837c0.69854,-1.51257 2.48265,-2.5908 4.58012,-2.58928c2.70368,0.00304 4.89069,1.7844 4.89722,3.98567c0,0.12225 -0.00839,0.24754 -0.02518,0.37738c-0.0457,0.39257 0.28445,0.74717 0.76009,0.81931c1.73468,0.26121 3.05342,1.49282 3.05062,2.97881c-0.00373,1.6781 -1.66847,3.035 -3.72864,3.03956z" fill="{0}"/>`, `<path d="m25.79149,13.06688c6.03524,-14.18338 29.68152,0 0,18.23578c-29.68152,-18.23578 -6.03524,-32.41916 0,-18.23578z" stroke="#000" fill="{0}"/>`, `<path d="m87.79815,70.30834c-2.25552,-0.76485 -3.8722,-3.19515 -3.50479,-5.26863c0.23168,-1.30749 5.11945,-9.24485 5.5463,-9.00677c0.13932,0.0777 1.3791,1.92824 2.75506,4.11229c2.20415,3.49863 2.50175,4.15102 2.50175,5.48421c0,2.70232 -2.3965,4.91582 -5.274,4.87128c-0.83969,-0.013 -1.75064,-0.09957 -2.02433,-0.19238l0,0zm2.25977,-1.35917c0.07466,-0.34985 -0.09974,-0.52048 -0.532,-0.52048c-0.98517,0 -2.35176,-1.12602 -2.65707,-2.18933c-0.32569,-1.13427 -1.18924,-1.26916 -1.31679,-0.2057c-0.24574,2.04891 4.09186,4.85555 4.50587,2.91551l0,0z" stroke="#000" fill="{0}"/>`, `<path stroke="#000" d="m38.10155,52.29408c-2.18717,-0.78223 -3.75486,-3.26776 -3.39858,-5.38837c0.22465,-1.3372 4.96431,-9.45496 5.37823,-9.21147c0.1351,0.07947 1.33731,1.97206 2.67157,4.20576c2.13736,3.57814 2.42594,4.24536 2.42594,5.60885c0,2.76373 -2.32388,5.02755 -5.11417,4.98199c-0.81425,-0.0133 -1.69759,-0.10183 -1.96298,-0.19675l0,0zm2.19129,-1.39006c0.0724,-0.35781 -0.09672,-0.53231 -0.51588,-0.53231c-0.95531,0 -2.28049,-1.15161 -2.57656,-2.23909c-0.31582,-1.16004 -1.1532,-1.29801 -1.27689,-0.21037c-0.2383,2.09548 3.96786,4.9659 4.36932,2.98177l0,0z" fill="{0}"/>`];

const json = {
    "description": "",
    "image": "",
    "name": "Hotspur nft",
    "attributes": [
    ]
};

let colors = [
    '#FFCB00',
    '#4C4C4C',
    '#39AA1D',
    '#57C335',
    '#00baf7',
    '#ebebeb',
    '#000000',
    '#e75300',
    '#EFA94A',
    '#CFD3CD',
    '#1C542D',
    '#922B3E',
    '#A52019',
    '#5B3A29',
    '#9B111E'
];

const main = async () => {

    for (let j = 0; j < 100; j++) {
        let s = svg;
        const logoColors = [];
        for (let i = 0; i < 4; i++) {
            let color = colors[Math.random() * colors.length | 0];
            logoColors.push(color);
            s = s.replaceAll(`{${i}}`, color);
        }
        const attributes: { trait_type: string, value: string }[] = [{
            "trait_type": "Background",
            "value": ""
        },
        {
            "trait_type": "Body",
            "value": ""
        },
        {
            "trait_type": "Head",
            "value": ""
        },
        {
            "trait_type": "Face",
            "value": ""
        },
        {
            "trait_type": "Eyes",
            "value": ""
        },
        {
            "trait_type": "Mouth",
            "value": ""
        },
        {
            "trait_type": "Mask",
            "value": ""
        },
        {
            "trait_type": "Cloud",
            "value": ""
        },
        {
            "trait_type": "Heart",
            "value": ""
        },
        {
            "trait_type": "Cry",
            "value": ""
        },
        {
            "trait_type": "Drop",
            "value": ""
        }];
        attributes[0].value = logoColors[0];
        attributes[1].value = logoColors[1];
        attributes[2].value = logoColors[2];
        attributes[3].value = logoColors[3];

        //eyes
        const eye = getRandomInt([100, 5]);
        attributes[4].value = eye.toString();
        s = s.replace('{4}', eyes[eye].replaceAll('{0}', colors[Math.random() * colors.length | 0]));
        //mouth
        const m = getRandomInt([1, 1, 1]);
        attributes[5].value = m.toString();
        s = s.replace('{5}', mouth[m].replaceAll('{0}', colors[Math.random() * colors.length | 0]));
        //mask
        const msk = getRandomInt([100, 6]);
        attributes[6].value = msk.toString();
        s = s.replace('{6}', mask[msk].replaceAll('{0}', colors[Math.random() * colors.length | 0]));
        //attributes
        for (let u = 0; u < addons.length; u++) {
            const attr = getRandomInt([100, 6]);
            attributes[7 + u].value = attr.toString();
            s = attr == 1 ? (s.replace('{7}', '{7}' + addons[u].replaceAll('{0}', colors[Math.random() * colors.length | 0]))) : s;
        }
        s = s.replace('{7}', '');

        images.push({
            file: {
                path: `i/${j}.svg`,
                content: Buffer.from(s, "utf-8")
            },
            jsonFile: { ...json, attributes }
        });
    }
    const createdImages = (await ipfs.files.add(images.map(m => m.file))).map((m: { hash: string }) => m.hash);

    fs.writeFileSync('./../ipfs.json',
        JSON.stringify(
            (await ipfs.files.add(
                images.map((m, i) => {
                    return ({ path: `i/${i}.svg`, content: Buffer.from(JSON.stringify({ ...m.jsonFile, image: createdImages[i] }), 'utf-8') });
                })
            )).map((m: { hash: string }) => m.hash)));
};
main();
function getRandomInt(weights: number[]) {
    const w: number[] = [];
    const sum = weights.reduce((partialSum, a) => partialSum + a, 0);
    const fn = (x: number) => {
        w.push(...(new Array(Math.floor(weights[x] * 100 / sum))).fill(x));
    };
    for (let i = 0; i < weights.length; i++) {
        fn(i);
    }
    return w[Math.floor(Math.random() * w.length)];
}