require("dotenv").config({ path: "../.env" });

const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

async function main() {
    console.log("🌱 Seeding database...");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@gmail.com" },
        update: {},
        create: {
            email: "admin@gmail.com",
            name: "Admin",
            password: hashedPassword,
            role: "ADMIN",
            bio: "System Administrator",
            isVerified: true
        },
    });

    const agent1 = await prisma.user.upsert({
        where: { email: "agent1@gmail.com" },
        update: {},
        create: {
            email: "agent1@gmail.com",
            name: "Rajesh Sharma",
            password: hashedPassword,
            role: "AGENT",
            bio: "Senior Agent - North & Central India",
            phone: "+919876543210",

            isVerified: true
        },
    });

    const agent2 = await prisma.user.upsert({
        where: { email: "agent2@gmail.com" },
        update: {},
        create: {
            email: "agent2@gmail.com",
            name: "Priya Mehta",
            password: hashedPassword,
            role: "AGENT",
            bio: "Senior Agent - West & South India",
            phone: "+919812345678",
            isVerified: true
        },
    });

    const user1 = await prisma.user.upsert({
        where: { email: "user1@gmail.com" },
        update: {},
        create: {
            email: "user1@gmail.com",
            name: "Amit Kumar",
            password: hashedPassword,
            role: "USER",
            bio: "Looking for a flat in Bangalore",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "user2@gmail.com" },
        update: {},
        create: {
            email: "user2@gmail.com",
            name: "Neha Verma",
            password: hashedPassword,
            role: "USER",
            bio: "Looking for investment property",
        },
    });

    console.log("✅ Users created");

    await prisma.inquiry.deleteMany();
    await prisma.savedListing.deleteMany();
    await prisma.listing.deleteMany();

    const properties = [
        {
            title: "Luxury Villa in South Delhi",
            location: "South Delhi, Delhi",
            price: 45000000,
            type: "SALE",
            propertyType: "VILLA",
            bedrooms: 5,
            bathrooms: 5,
            area: 4200,
            tags: ["luxury", "prime"],
        },
        {
            title: "3BHK Apartment in Noida",
            location: "Noida, Uttar Pradesh",
            price: 12000000,
            type: "SALE",
            propertyType: "APARTMENT",
            bedrooms: 3,
            bathrooms: 2,
            area: 1650,
            tags: ["family", "gated"],
        },
        {
            title: "Sea View Apartment in Mumbai",
            location: "Worli, Mumbai",
            price: 38000000,
            type: "SALE",
            propertyType: "APARTMENT",
            bedrooms: 3,
            bathrooms: 3,
            area: 1800,
            tags: ["sea-view", "premium"],
        },
        {
            title: "Penthouse in Pune",
            location: "Baner, Pune",
            price: 22000000,
            type: "SALE",
            propertyType: "PENTHOUSE",
            bedrooms: 4,
            bathrooms: 4,
            area: 3000,
            tags: ["penthouse", "luxury"],
        },
        {
            title: "Tech Park Apartment in Bangalore",
            location: "Whitefield, Bangalore",
            price: 14000000,
            type: "SALE",
            propertyType: "APARTMENT",
            bedrooms: 3,
            bathrooms: 2,
            area: 1550,
            tags: ["it-hub", "investment"],
        },
        {
            title: "Villa in ECR Chennai",
            location: "ECR, Chennai",
            price: 26000000,
            type: "SALE",
            propertyType: "VILLA",
            bedrooms: 4,
            bathrooms: 4,
            area: 2800,
            tags: ["villa", "premium"],
        },
        {
            title: "Family Home in Raipur",
            location: "Raipur, Chhattisgarh",
            price: 6500000,
            type: "SALE",
            propertyType: "HOUSE",
            bedrooms: 3,
            bathrooms: 2,
            area: 1900,
            tags: ["family", "budget"],
        },
        {
            title: "Riverside Cottage in Kerala",
            location: "Alappuzha, Kerala",
            price: 9000000,
            type: "SALE",
            propertyType: "COTTAGE",
            bedrooms: 2,
            bathrooms: 2,
            area: 1400,
            tags: ["nature", "tourism"],
        },
    ];

    const images = [
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
        "https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg",
    ];

    const amenities = ["Parking", "Security", "Power Backup", "Lift", "Garden"];

    const createdListings = [];

    for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        const assignedAgent = i % 2 === 0 ? agent1 : agent2;

        const listing = await prisma.listing.create({
            data: {
                title: prop.title,
                description: `${prop.title} located in ${prop.location}`,
                price: prop.price,
                location: prop.location,
                type: prop.type,
                propertyType: prop.propertyType,
                bedrooms: prop.bedrooms,
                bathrooms: prop.bathrooms,
                area: prop.area,
                amenities: amenities,
                images: images,
                tags: prop.tags,
                status: "ACTIVE",
                userId: assignedAgent.id,
            },
        });

        createdListings.push(listing);
    }

    console.log("✅ Listings created");

    await prisma.savedListing.create({
        data: {
            userId: user1.id,
            listingId: createdListings[0].id,
        },
    });

    await prisma.savedListing.create({
        data: {
            userId: user2.id,
            listingId: createdListings[1].id,
        },
    });

    await prisma.inquiry.create({
        data: {
            userId: user1.id,
            listingId: createdListings[2].id,
            message: "I am interested in this property. Please share details.",
        },
    });

    await prisma.inquiry.create({
        data: {
            userId: user2.id,
            listingId: createdListings[3].id,
            message: "Is this negotiable?",
        },
    });

    console.log("✅ Saved listings & inquiries created");
    console.log("🌱 Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
