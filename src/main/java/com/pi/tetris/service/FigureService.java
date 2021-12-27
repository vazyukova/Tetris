package com.pi.tetris.service;

import com.pi.tetris.Test;
import com.pi.tetris.model.Figure;
import com.pi.tetris.model.Glass;
import com.pi.tetris.model.Level;
import com.pi.tetris.repository.FigureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FigureService {
    final FigureRepository figureRepository;

    public FigureService(FigureRepository figureRepository) {
        this.figureRepository = figureRepository;
    }

    public List<Figure> findAll(){
        return figureRepository.findAll();
    }

    public List<Figure> findByMatrix(String matrix){
        return figureRepository.findByMatrix(matrix);
    }

    public Figure save(Figure figure){
        List<Figure> duplicateFigures = findByMatrix(figure.getMatrix());
        if (!check(getMatrixFromString(figure.getMatrix()))){
            return new Figure();
        }
        if (!duplicateFigures.isEmpty() || !checkDuplicates(figure))
            return null;
        return figureRepository.save(figure);
    }

    public Figure edit(Figure figure){
        return figureRepository.save(figure);
    }

    public Figure findById(int id){
        return figureRepository.findById(id);
    }

    public void remove(Figure figure){
        figureRepository.delete(figure);
    }

    public List<Figure> findByLevel(Level level){
        return figureRepository.findByLevel(level);
    }

    private boolean checkDuplicates (Figure figure){
        List<int[][]> allFigures = findAll().stream()
                .map(figure1 -> getMatrixFromString(figure1.getMatrix()))
                .map(this::removeEmptyRowsAndColumns)
                .collect(Collectors.toList());
        int[][] currentMatrix = removeEmptyRowsAndColumns(getMatrixFromString(figure.getMatrix()));
        int[][] matr2 = rotate(currentMatrix);
        int[][] matr3 = rotate(matr2);
        int[][] matr4 = rotate(matr3);

        for (int[][] fig : allFigures){
            if (Arrays.deepEquals(fig, currentMatrix) || Arrays.deepEquals(fig, matr2) || Arrays.deepEquals(fig, matr3) || Arrays.deepEquals(fig, matr4))
                return false;
        }

        return true;
    }

    private int[][] removeEmptyRowsAndColumns(int[][] matrix){
        List<Integer> emptyRows = checkEmptyRows(matrix);
        List<Integer> emptyColumns = checkEmptyColumns(matrix);
        if (emptyRows.isEmpty() && emptyColumns.isEmpty()){
            return matrix;
        }
        else{
            int[][] newMatrix = new int[4 - emptyRows.size()][4 - emptyColumns.size()];
            int t = 0, k = 0;
            for (int i = 0; i < matrix.length; i++){
                k = 0;
                if (!emptyRows.contains(i)){
                    for (int j = 0; j < matrix.length; j++){
                        if(!emptyColumns.contains(j)){
                            newMatrix[t][k] = matrix[i][j];
                            k++;
                        }
                    }
                    t++;
                }
            }
            return newMatrix;
        }
    }

    private List<Integer> checkEmptyRows(int[][] matrix){
        List<Integer> emptyRows = new ArrayList<>();
        for (int i = 0; i < matrix.length; i++) {
            int flag = 0;
            for (int anInt : matrix[i]) {
                if (anInt == 0) {
                    flag++;
                }
            }
            if (flag == 4){
                emptyRows.add(i);
            }
        }
        return emptyRows;
    }

    private List<Integer> checkEmptyColumns(int[][] matrix){
        List<Integer> emptyColumns = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            int flag = 0;
            for (int j = 0; j < 4; j++) {
                if (matrix[j][i] == 0)
                    flag++;
            }
            if (flag == 4){
                emptyColumns.add(i);
            }
        }
        return emptyColumns;
    }

    private int[][] getMatrixFromString(String str){
        int[][] matrix = new int[4][4];
        String[] rows = str.split("\\|", 4);
        int i = 0;
        for (String row : rows)
        {
            int j = 0;
            String[] columns = row.split(",", 4);
            for (String column : columns)
            {
                matrix[i][j] = Character.getNumericValue(column.charAt(0));
                j++;
            }
        i++;
        }
        return matrix;
    }

    private int[][] rotate(int[][] matrix){
        int[][] newMatrix = new int[matrix[0].length][matrix.length];
        for (int i = 0; i < matrix[0].length; i++){
            for (int j = 0; j < matrix.length; j++){
                newMatrix[i][j] = matrix[matrix.length - j - 1][i];
            }
        }
        return newMatrix;
    }

    private static class Coord{
        int i;
        int j;
        public Coord(int i, int j){
            this.i = i;
            this.j = j;
        }
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
                        current = new Coord(current.i - 1, current.j);
                        cc.add(current);
                        checked.add(current);
                        flag = true;
                    } if (current.i != 3 && matrix[current.i + 1][current.j] == 1 && !contains(checked, current.i + 1, current.j)) {
                        current = new Coord(current.i + 1, current.j);
                        cc.add(current);
                        checked.add(current);
                        flag = true;
                    } if (current.j != 0 && matrix[current.i][current.j - 1] == 1 && !contains(checked, current.i, current.j - 1)) {
                        current = new Coord(current.i, current.j - 1);
                        cc.add(current);
                        checked.add(current);
                        flag = true;
                    } if (current.j != 3 && matrix[current.i][current.j + 1] == 1 && !contains(checked, current.i, current.j + 1)) {
                        current = new Coord(current.i, current.j + 1);
                        checked.add(current);
                        cc.add(current);
                        flag = true;
                    } if(!flag && !contains(checked, current.i, current.j)) {
                        return false;
                    }
                }
                cc.forEach(System.out :: println);
                currentList = cc;
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
