//
//  ReminderStatsView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-22.
//

import SwiftUI

struct ReminderStatsView: View {
    
    let icon: String
    let title: String
    let count: Int?
    var iconColor: Color = .blue
    
    var body: some View {
        VStack{
            HStack{
                VStack{
                    Image(systemName: icon)
                        .foregroundStyle(iconColor)
                        .font(.title)
                    Text(title)
                        .opacity(0.8)
                }
                Spacer()
                if let count {
                    Text("\(count)")
                        .font(.largeTitle)
                }
            }.padding()
                .frame(maxWidth: .infinity)
                .background(.gray)
                .clipShape(RoundedRectangle(cornerRadius: 16.0, style: .continuous))
        }
    }
    
}

#Preview {
    ReminderStatsView(icon: "calendar", title: "today", count: 9)
}
