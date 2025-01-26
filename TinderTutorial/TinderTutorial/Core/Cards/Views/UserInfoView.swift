//
//  UserInfoView.swift
//  TinderTutorial
//
//  Created by Shimin Cheng on 2025-01-14.
//

import SwiftUI

struct UserInfoView: View {
    @Binding var showProfileModel: Bool
    let user: User
    
    var body: some View {
        VStack(alignment:.leading) {
            HStack{
                Text(user.fullname)
                    .font(.title)
                    .fontWeight(.heavy)
                
                Text("\(user.age)")
                    .font(.title)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button{
                    showProfileModel = true
                }label: {
                    Image(systemName: "arrow.up.circle")
                        .fontWeight(.bold)
                        .imageScale(.large)
                }
            }
            
            Text("Some test bio for now")
                .font(.subheadline)
                .lineLimit(2)
        }
        .foregroundStyle(.white)
        .padding()
        .background{
            LinearGradient(colors: [.clear,.black], startPoint: .top, endPoint: .bottom)
        }
    }
}

#Preview {
    UserInfoView(showProfileModel: .constant(false),user: MockData.users[0] )
}
