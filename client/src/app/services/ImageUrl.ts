const getImageUrl = (imageUrl: string)=>{
    const UPLOAD_DIRECTORY = process.env["UPLOAD_DIRECTORY"] || "http://localhost:4000/uploads/";

    return UPLOAD_DIRECTORY + imageUrl
}

export default getImageUrl;