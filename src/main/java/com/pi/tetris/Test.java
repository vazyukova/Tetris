package com.pi.tetris;

import com.pi.tetris.service.FigureService;

import java.util.ArrayList;
import java.util.List;

public class Test {
    private static class Coord{
        int i;
        int j;
        public Coord(int i, int j){
            this.i = i;
            this.j = j;
        }
    }
    public static void main(String[] args) {

        int[][] matrix = {{0, 0, 0, 0}, {0, 1, 1, 0}, {0, 1, 1, 0}};
        check(matrix);
    }

    private static int[][] rotate(int[][] matrix){
        int[][] newMatrix = new int[matrix[0].length][matrix.length];
        for (int i = 0; i < matrix[0].length; i++){
            for (int j = 0; j < matrix.length; j++){
                newMatrix[i][j] = matrix[matrix.length - j - 1][i];
            }
        }
        return matrix;
    }
    public static boolean check(int[][]matrix){
        List<Coord> checked = new ArrayList<>();
        List<Coord> currentList = new ArrayList<>();
        Coord c = checkFirstFill(matrix);
        currentList.add(c);
        checked.add(c);
        boolean flag = false;
        while(true) {
            if (!checkFill(matrix, checked)){
                return true;
            }
            else {
                List<Coord> cc = new ArrayList<>();
                for (Coord current : currentList) {
                    flag = false;
                    if (current.i != 0 && matrix[current.i - 1][current.j] == 1 && !contains(checked, current.i - 1, current.j)) {
                        Coord current1 = new Coord(current.i - 1, current.j);
                        cc.add(current1);
                        checked.add(current1);
                        flag = true;
                    } if (current.i != 3 && matrix[current.i + 1][current.j] == 1 && !contains(checked, current.i + 1, current.j)) {
                        Coord current1 = new Coord(current.i + 1, current.j);
                        cc.add(current1);
                        checked.add(current1);
                        flag = true;
                    } if (current.j != 0 && matrix[current.i][current.j - 1] == 1 && !contains(checked, current.i, current.j - 1)) {
                        Coord current1 = new Coord(current.i, current.j - 1);
                        cc.add(current1);
                        checked.add(current1);
                        flag = true;
                    } if (current.j != 3 && matrix[current.i][current.j + 1] == 1 && !contains(checked, current.i, current.j + 1)) {
                        Coord current1 = new Coord(current.i, current.j + 1);
                        checked.add(current1);
                        cc.add(current1);
                        flag = true;
                    } if(!flag) {
                        return false;
                    }
                }
                currentList.addAll(cc);
            }
        }
    }

    public static boolean checkFill(int[][] matrix, List<Coord>checked){
        for (int i = 0; i < 4; i++){
            for (int j = 0; j < 4; j++){
                if (matrix[i][j] == 1 && !contains(checked, i, j))
                    return true;
            }
        }
        return false;
    }

    public static boolean contains(List<Coord> checked, int i, int j){
        for (Coord c : checked){
            if (c.i == i && c.j == j)
                return true;
        }
        return false;
    }
    public static Coord checkFirstFill(int[][] matrix){
        for (int i = 0; i < 4; i++){
            for (int j = 0; j < 4; j++){
                if (matrix[i][j] == 1)
                    return new Coord(i, j);
            }
        }
        return null;
    }
}
