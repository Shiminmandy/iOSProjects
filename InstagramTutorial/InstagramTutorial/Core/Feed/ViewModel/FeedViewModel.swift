//
//  FeedViewModel.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-28.
//

import Foundation
import Firebase

class FeedViewModel: ObservableObject{

    @Published var posts = [Post]()
    
    // when initialize this class, its automatically call fetchPosts()
    init() {
        Task{ try await fetchPosts()}
    }
    
    func fetchPosts() async throws{
        let snapshot = try await Firestore.firestore().collection("posts").getDocuments()
        self.posts = try snapshot.documents.compactMap({ document in
            let posts = try document.data(as: Post.self)
            return posts
        })
        
        //self.post = try snapshot.documents.compactMap({try $0.data(as: Post.self)})
    }
}
