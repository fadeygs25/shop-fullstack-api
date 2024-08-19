const bcrypt = require("bcryptjs");

//i create first data.js for seed all datas into db
const data = {
    carts: [

    ],

    categories: [

    ],

    products: [

    ],


    ratings: [

    ],

    users: [
        {
            username: "Admin2510",
            number: "0934907430",
            email: "admin@gmail.com",
            address: "30 Đàm thanh 7",
            pic: "https://res.cloudinary.com/dungnguyen25/image/upload/v1679318563/avatar-default/143086968_2856368904622192_1959732218791162458_n_edneps.png",
            password: bcrypt.hashSync("111111111", 10),
            role: "admin",
        }
    ],

}

module.exports = data;