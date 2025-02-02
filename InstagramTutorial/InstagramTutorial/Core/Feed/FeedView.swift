//
//  FeedView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI

struct FeedView: View {
    var body: some View {
        NavigationStack{
            ScrollView{
                LazyVStack(spacing:32){
                    ForEach(0...10, id:\.self){ post in
                        FeedCell()
                    }
                }
                .padding(.top,8)
            }
            .navigationTitle("Feed")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar{
                ToolbarItem(placement: .navigationBarLeading){
                    Image("instagram")
                        .resizable()
                        .frame(width: 100,height: 45)
                }
                
                ToolbarItem(placement: .navigationBarTrailing){
                    Image(systemName: "paperplane")
                        .imageScale(.large)
                        
                }
            }
        }
    }
}

#Preview {
    FeedView()
}
