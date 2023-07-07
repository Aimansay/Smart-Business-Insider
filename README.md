# Smart-Business-Insider

## Group Members
1. Haroon Riaz (Group Leader)
2. Ahmed Raza Warraich
3. Umair Ahmed

## Run Instructions

### Frontend 
Unzip the project and go in the smartBusinessInsider directory, there run the command **npm expo start** . Open the project in any emulator or scan the QR code from expo go application from your mobile.

### backend 
Unzip the project and go in smartBusinessInsider/backend directory, there run the command **npm start start**.

## Introduction
Smart Business Insider is basically an application designed and developed to address the needs and difficulties faced by local business owners
who does not have access to or cannot afford Computers, Store management softwares, barcode scanners and receipt printers. It will help manage the business owners to 
keep track of their earnings, sales, profits, most selling items etc. It will also forcast the business earnings for the coming month. The application will also faciliate in report generation and Bill Generation.
We have integerated a barcode scanner in the application so that user does not have to buy it seperatly he can scan the products via his mobile camera easily. Furthermore, the application will also help
the owner to manage business's inventory smartly.

## Features
1. Data Analysis
2. Data Visualization
3. Dashboard
4. Report Generation
5. Barcode Scanner
6. Bill Generation
7. Inventory Management

## Screens

### Welcome Screen

![WelcomeScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/b8ee1b31-6d2f-4fdf-87e0-017115d64ccb)

When appilcation first starts, it displays a welcome screen. User can then go to sign up from there to create a new account or can log in to an existing one. User can also be able to sign in with his google account.

### Sign Up Screen

![SignUpScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/84dc8136-8b67-4e30-af1d-e6c03b4e1af8)

Here User can create their account by adding email, name, business name, username, password. All the fields are validated. Once entered all the fields, an account will be created in the database.

### Log In Screen

![LoginScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/11b3bcbf-1e1b-40a5-91ef-6061c04731ef)

This is the Log In Screen. User can enter email and password here and once pressed on Log In, Credentials will be matched with the database and once matched User will be take to the home screen.

### Home Screen

![HomeScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/4f24565b-dbbd-4dcd-9c80-0d2e46a53385)

This is the main screen of the application. It gives the user a brief overview of his/her business. It also shows sic month Earning in the form of a line graph which also includes the forcasted earning for the next month. In the bottom, it shows the most profitable and least profitable item of the present month.

### Analytics

![Analytics1](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/ba22e171-5191-460a-95c0-edb48a775032)
![Analytics2](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/f2bc9be1-ab68-44fb-b3fe-e77dd94c4137)

In Analytics, User will be able to see his sales, earnings and most Selling Items. User will have the option to see 3 months data, 6 months data or 12 months data. User will also be able to generate a report in pdf format
of the selected data too by clicking on generate report. 

### Inventory

![Inventory](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/c17705c6-2d81-4c86-9c80-b6a3debe0201)

This is the inventory section. Here user can add, delete and edit their items. Item with stock less than 10 will be marked red to show user of understock item. User can also add barcode by scanning with his mobile camera in the application.

#### Add Item Panel

![AddItem](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/1955205c-6281-4f31-9a7e-328cbb1c92f4)

##### Add item with barcode

![AddItemWithBarcode](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/e359ce69-b66e-4fe5-9c33-6b7732a7a529)

#### Delete Item (Swipe left)

![DeleteButton](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/33a5f786-5c45-4ff2-91cd-fc60532dbe82)

#### Edit Item (Swipe Right)

![EditButton](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/33065eeb-dee5-43a7-8e82-bdc01d6ee382)

#### Edit Item Panel

![EditItem](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/0d16d062-683b-4064-a7fe-06d4d7a7f093)

### Billing Screen

![BillingScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/c05b9266-55c4-4868-adb0-5b89be2c2793)

User can add and generate bills from here. User can search the items in search bar or can scan them using in-built barcode scanner. User can also send the Bill to customer's WhatsApp Number. A payment link will also be send with the bill so that customer can pay via his mobile.

#### WhatsApp Bill

![WhatsAppBill](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/005c04b2-642b-4a8b-9210-0f039f4ccc74)

#### Barcode in Billing Screen

![BilingScreenWithBarcode](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/335063e7-e183-46c8-bcc6-1028715f6665)

### Records Screen

![RecordsScreen1](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/8ecdbbeb-26c5-400f-a761-760a95707edb)

In this screen, User will be able to see all the previous records of bills.

### Settings Screen

![SettingsScreen](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/2d8d8dc7-7a2d-4f01-a7e8-eccd00cd323b)

Here User can add business logo, Change Business Name and Change password.

### Navigation Screen

![Navigation](https://github.com/haroonriaz-15/Smart-Business-Insider/assets/61004113/71ee54b6-e596-43af-85a0-f7dc6f38c286)

This is the naviagtion Screen which will slide out when user click on the menu icon. It is a custom build navigation screen.
