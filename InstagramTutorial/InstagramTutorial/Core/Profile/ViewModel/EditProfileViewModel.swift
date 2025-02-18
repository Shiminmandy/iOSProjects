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
    
    init(user: User){
        self.user = user
    }
    
    func loadImage(fromItem item: PhotosPickerItem?) async{
        guard let item =  item else {return}
        
        guard let data = try? await item.loadTransferable(type: Data.self) else {return}
        guard let uiImage = UIImage(data: data) else {return}
        self.profileImage = Image(uiImage: uiImage)
    }
    
    func uploadUserData() async throws{
        
        // update profile
        var data = [String: Any]()
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
