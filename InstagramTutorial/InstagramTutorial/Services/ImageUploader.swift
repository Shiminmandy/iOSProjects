//
//  ImageUploader.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-18.
//

import Foundation
import UIKit
import Firebase
import FirebaseStorage

struct ImageUploader{
    static func uploadImage(image: UIImage) async throws -> String?{
        guard let imageData = image.jpegData(compressionQuality: 0.5) else {return nil}
        let filename = NSUUID().uuidString
        let ref = Storage.storage().reference(withPath: "/profile_images/\(filename)")
        
        do{
            let _ = try await ref.putDataAsync(imageData)
            let url = try await ref.downloadURL()
            return url.absoluteString
            
        }catch{
            print("DEBUG: Failed to upload image with error \(error.localizedDescription)")
            return nil
        }
    }
}
