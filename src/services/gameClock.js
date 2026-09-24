const RATE=7, OFFSET=10800000;
function tarkovPair(now=Date.now()){const accelerated=now*RATE;const one=((accelerated+OFFSET)%86400000+86400000)%86400000;const two=(one+43200000)%86400000;return [one,two].map(ms=>{const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return{hour:h,minute:m,second:s,text:[h,m,s].map(x=>String(x).padStart(2,'0')).join(':'),period:h>=6&&h<18?'day':'night'}})}
module.exports={tarkovPair};
