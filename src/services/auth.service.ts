import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const registerUser = async (data: any) => {
    const {
        role,
        name,
        email,
        password,
        phone,
        bloodType,
        hospitalName,
        location,
        latitude,
        longitude,
    } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "hospital") {
        const [lat, lng] = location
            ? location.split(",").map((v: string) => parseFloat(v))
            : [latitude || 0, longitude || 0];

        const user = await prisma.user.create({
            data: {
                fullName: name,
                email,
                password: hashedPassword,
                phone,
                role: "HOSPITAL",
                latitude: lat,
                longitude: lng,
                hospital: {
                    create: {
                        name: name,
                        address: "", 
                        phone: phone || "",
                        latitude: lat,
                        longitude: lng,
                    },
                },
            },
            include: { hospital: true },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return { user, token };
    } else {
        // Regular donor
        const user = await prisma.user.create({
            data: {
                fullName: name,
                email,
                phone,
                password: hashedPassword,
                role: "USER",
                bloodGroup: bloodType,
                latitude: latitude || 0,
                longitude: longitude || 0,
            },
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return { user, token };
    }
};

export const loginUser = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { hospital: true },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return {
        message: "Login successful",
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            bloodGroup: user.bloodGroup,
            hospital: user.hospital || null,
        },
        token,
    };
};