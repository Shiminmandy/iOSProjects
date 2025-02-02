//
//  SearchView.swift
//  InstagramTutorial
//
//  Created by Shimin Cheng on 2025-02-01.
//

import SwiftUI

// a scrollable search list result
struct SearchView: View {
    
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            ScrollView{
                LazyVStack(spacing:12){
                    ForEach(0 ... 15, id:\.self){ user in
                        HStack {
                            Image("lusi2")
                                .resizable()
                                .scaledToFill()
                                .frame(width: 40,height: 40)
                                .clipShape(Circle())
                            
                            VStack{
                                Text("zhaolusi")
                                    .fontWeight(.semibold)
                                
                                Text("actress")
                            }
                            .font(.footnote)
                            
                            Spacer()
                        }
                        .padding(.horizontal)
                        
                    }
                }
                .padding(.top,8)
                .searchable(text: $searchText,prompt:"Search...")
            }
            .navigationTitle("Explore")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    SearchView()
}
