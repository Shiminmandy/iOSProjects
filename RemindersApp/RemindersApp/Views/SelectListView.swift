//
//  SelectListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-07.
//

import SwiftUI

struct SelectListView: View {
    
    @FetchRequest(sortDescriptors: [])
    private var myListFetchResults: FetchedResults<MyList>
    
    @Binding var selectedList: MyList?
    

    var body: some View {
        List(myListFetchResults) { mylist in
            HStack{
                HStack{
                    Image(systemName: "line.3.horizontal.circle.fill")
                        .foregroundStyle(Color(mylist.color))
                    Text(mylist.name)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .contentShape(Rectangle())
                .onTapGesture {
                    self.selectedList = mylist
                }
                
                Spacer()
                
                if selectedList == mylist{
                    Image(systemName: "checkmark")
                }
            }
        }
    }
}

#Preview {
    SelectListView(selectedList: .constant(PreviewData.myList))
        .environment(\.managedObjectContext,CoreDataProvider.shared.persistentContainer.viewContext)
}
