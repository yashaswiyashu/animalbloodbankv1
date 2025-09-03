export interface IFarmer {
    farmer_name: string;
    farmer_phone: string;
    // farmer_address: string;
    farmer_city: string;
    farmer_taluk: string;
    farmer_district: string;
    farmer_state: string;
    farmer_country: string;
    farmer_pin_code: string;
    farmer_password: string;
    farmer_role: "farmer";
    comparePassword(candidatePassword: string): Promise<boolean>;
}
