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
    
    @MainActor
    func fetchPosts() async throws{
        self.posts = try await PostService.fetchFeedPosts()
        
        
    }
}
