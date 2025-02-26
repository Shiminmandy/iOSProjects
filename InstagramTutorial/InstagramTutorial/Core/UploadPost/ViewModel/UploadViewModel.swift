//
//  UploadViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-05.
//

import Foundation
import PhotosUI
import SwiftUI
import FirebaseAuth
import Firebase

//ObservableObject这个协议只能被clss遵守，这是因为class的特性，class允许在多个视图共享一个对象
@MainActor
class UploadViewModel: ObservableObject{
    
    @Published var selectedImage: PhotosPickerItem? {
        didSet {
            Task {
                await loadImage(fromItem: selectedImage)
            }
        }
    }
    
    @Published var postImage: Image?
    private var uiImage: UIImage?
    
    func loadImage(fromItem item: PhotosPickerItem?) async{
        guard let item =  item else {return}
        
        guard let data = try? await item.loadTransferable(type: Data.self) else {return}
        guard let uiImage = UIImage(data: data) else {return}
        self.uiImage = uiImage
        self.postImage = Image(uiImage: uiImage)
    }
    
    func uploadPost(caption: String) async throws {
        guard let uid = Auth.auth().currentUser?.uid else { return}
        guard let uiImage = uiImage else {return}
        
        // FireStore的数据由集合(collection)和文档(document)组成，该代码为正在“访问”或“创建名为post的集合
        // .document()为创建一个具有随机唯一id的文档引用，此时并没有开始数据库交互
        let postRef = Firestore.firestore().collection("posts").document()
        guard let imageUrl = try await ImageUploader.uploadImage(image: uiImage) else{ return }
        let post = Post(id: postRef.documentID, ownerUid: uid, caption: caption, likes: 0, imageUrl: imageUrl, timestamp: Timestamp(), user: nil)
        guard let encodedPost = try? Firestore.Encoder().encode(post) else {return}
        
        try await postRef.setData(encodedPost)
    }
}
