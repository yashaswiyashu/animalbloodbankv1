export interface IUser {
    user_name: string;
    user_phone: string;
    user_email: string;
    // user_address: string;
    city: string;
    taluk: string;
    district: string;
    state: string;
    country: string;
    pin_code: string;
    user_password: string;
    user_role: "admin" | "doctor" | "hospital" | "pharmacy" | "lab" | "organisation" | "Animal Enthusiasts";
    comparePassword(candidatePassword: string): Promise<boolean>;
    specialization?: string;
    govt_id?: string; // Only for doctors
    govt_id_image?: string; // Only for doctors (image path)
    gst_number?: string; // Only for vendors
    organisation_id?: string;
    hospital_id?: string;
    approved?: boolean; // Default is false
}   
