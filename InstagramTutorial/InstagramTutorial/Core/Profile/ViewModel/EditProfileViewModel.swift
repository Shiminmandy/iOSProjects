//
//  EditProfileViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-17.
//

import Foundation
import PhotosUI
import SwiftUI
import FirebaseFirestore

@MainActor
class EditProfileViewModel: ObservableObject {
    
    @Published var user: User
    
    @Published var selectedImage: PhotosPickerItem? {
        didSet {
            Task {
                await loadImage(fromItem: selectedImage)
            }
        }
    }
    
    @Published var profileImage: Image?
    @Published var bio = ""
    @Published var fullname = ""
    
    
    // after make imageUploader
    private var uiImage: UIImage?
    
    init(user: User){
        self.user = user
        
        if let fullname = user.fullname {
            self.fullname = fullname
        }
        if let bio = user.bio{
            self.bio = bio
        }
    }
    
    func loadImage(fromItem item: PhotosPickerItem?) async{
        guard let item =  item else {return}
        
        guard let data = try? await item.loadTransferable(type: Data.self) else {return}
        guard let uiImage = UIImage(data: data) else {return}
        self.uiImage = uiImage
        self.profileImage = Image(uiImage: uiImage)
    }
    
    func uploadUserData() async throws{
        
        // update profile
        var data = [String: Any]()
        
        if let uiImage = uiImage{
            let imageUrl = try? await ImageUploader.uploadImage(image: uiImage)
            data["profileImageUrl"] = imageUrl
        }
        // update name
        if !fullname.isEmpty && user.fullname != fullname {
            data["fullname"] = fullname
        }
        // update bio
        if !bio.isEmpty && user.bio != bio {
            data["bio"] = bio
        }
        
        // stay updated with backend
        if !data.isEmpty{
            try await Firestore.firestore().collection("users").document(user.id).updateData(data)
        }
    }
}
