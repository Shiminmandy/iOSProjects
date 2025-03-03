//
//  AddNewListView.swift
//  RemindersApp
//
//  Created by Shimin Cheng on 2025-03-02.
//

import SwiftUI

struct AddNewListView: View {
    
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var selectedColor: Color = .blue
    
    private var isFormValid: Bool{
        !name.isEmptyOrWithWhitespace
    }
    let onSave: (String, UIColor) -> Void
    
    var body: some View {
        
        VStack{
            
            VStack{
                Image(systemName: "line.3.horizontal.circle.fill")
                    .foregroundStyle(selectedColor)
                    .font(.system(size: 100))
                
                TextField("List Name", text: $name)
                    .multilineTextAlignment(.center)
                    .textFieldStyle(.roundedBorder)
            }
            .padding(30)
            .clipShape(RoundedRectangle(cornerRadius: 10.0, style: .continuous))
            
            ColorPickerView(selectedColor: $selectedColor)
            
            Spacer()
        }.frame(maxWidth: .infinity, maxHeight: .infinity)
            //.background(Color(.systemPink))
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("New List")
                        .font(.headline)
                }
                
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close"){
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done"){
                        
                        // save the list
                        onSave(name,UIColor(selectedColor))
                        
                        dismiss()
                    }.disabled(!isFormValid)
                }
            }
    }
}

#Preview {
    NavigationStack{
        AddNewListView(onSave: {(_,_) in})
    }
}
