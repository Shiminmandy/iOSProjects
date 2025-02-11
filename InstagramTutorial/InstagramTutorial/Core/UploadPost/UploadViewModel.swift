//
//  UploadViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-05.
//

import Foundation
import PhotosUI
import SwiftUI

//ObservableObject这个协议只能被clss遵守，这是因为class的特性，class允许在多个视图共享一个对象

class UploadViewModel: ObservableObject{
    
    @Published var selectedImage: PhotosPickerItem? {
        didSet {
            Task {
                await loadImage(fromItem: selectedImage)
            }
        }
    }
    
    @Published var postImage: Image?
    
    func loadImage(fromItem item: PhotosPickerItem?) async{
        guard let item =  item else {return}
        
        guard let data = try? await item.loadTransferable(type: Data.self) else {return}
        guard let uiImage = UIImage(data: data) else {return}
        self.postImage = Image(uiImage: uiImage)
    }
    
}
