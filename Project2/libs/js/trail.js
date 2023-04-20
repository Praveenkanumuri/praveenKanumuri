const timestamp = 1679380200;
const date = new Date(timestamp * 1000);

const year = date.getFullYear();
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const day = ('0' + date.getDate()).slice(-2);
const hours = ('0' + date.getHours()).slice(-2);
const minutes = ('0' + date.getMinutes()).slice(-2);
const seconds = ('0' + date.getSeconds()).slice(-2);

const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
console.log(formattedDate);
const date1 = new Date('2023-03-22');
const dayOfWeek = date1.toLocaleString('en-US', { weekday: 'long' });
console.log(dayOfWeek);